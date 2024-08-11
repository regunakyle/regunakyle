+++
title = "如何實現VFIO及Looking Glass（硬件篇）"
author = "Eric Leung"
description = "VFIO硬件選擇教學"
categories = ["VFIO/Looking Glass系列"]
date = "2024-06-01"
+++

{{< css "/css/chinese.css" >}}

（本文最後更新時間：2024年8月11日）

## 前言

自從上次寫有關**VFIO**的文章已差不多有一年時間，這段時間內我使用**VFIO**虛擬機玩遊戲沒有遇到過問題，十分穩定，我對此非常滿意。

（不知道甚麼是VFIO/Looking Glass的讀者可讀我[介紹VFIO的文章](../002_windows_to_linux/)）

最近發生了三件事，令我決定重裝Linux：

1. Fedora推出了第40版，同時也為桌面環境KDE帶來了大更新
2. 我把原本用作安裝Windows 10虛擬機的SSD轉讓給家人
3. Looking Glass推出了B7-rc1版，據說性能上升不少

藉此機會把自己安裝**VFIO**虛擬機的步驟記下來，希望能幫助其他有興趣的人。

如果你想轉用Linux，但又不想放棄Windows平台上遊戲/生產力軟件，這篇文章應該非常適合你。

## 如何實現

在讀以下內容前，要注意以下事項：

1. 先去找找自己最常玩的遊戲是否支持Linux：如果能直接在Linux上玩的話就不用特意搞VFIO
2. 一些線上競技遊戲的反作弊系統可能禁止玩家用虛擬機或Linux，例如Riot Games的英雄聯盟（League of Legends）及特戰英豪（Valorant）；**你只能透過Dual boot玩這些遊戲**
3. 本文的安裝步驟只在Fedora 40 KDE上執行過，不一定適用於其他Linux發行版（Distribution）
4. 本文假設你的電腦**有至少兩張顯示卡**（CPU內顯或獨立顯示卡都可），不考慮只有單一顯示卡的情況

你可以去[Are We Anti Cheat Yet](https://areweanticheatyet.com/)和[ProtonDB](https://www.protondb.com/)找找你玩的遊戲可不可以在Linux上直接玩。

下文以「虛擬機卡」代指傳入虛擬機的顯示卡，「宿主機卡」代指宿主機使用的顯示卡。

{{< notice warning "單顯示卡" >}}
單顯示卡仍可設定**VFIO**虛擬機，不過設定上更麻煩，我也沒做過，所以不作說明。

如堅持要做，請先讀完[這個](https://madgpt.wipf.nl/FAQ/)再決定。注意**Looking Glass**要有至少兩張顯示卡才能運作。

 {{< /notice >}}

{{< figure src="./Cover.jpg" caption="我的電腦配置" >}}

### 硬件選擇

[Looking Glass硬件要求](https://looking-glass.io/docs/B7-rc1/requirements/)

[我的電腦配置](https://pcpartpicker.com/list/MBgG4M)

#### 主機板IOMMU

**VFIO**最看重的是主機板的IOMMU組：IOMMU組是可以傳入虛擬機的**最小硬件集合**。

（「將硬件傳入虛擬機」的正確術語是**PCIe Passthrough**）

任何插在主機板上PCIe設備都被分配在一個IOMMU組，如果有多個設備被分配到一個IOMMU組裡，你就只能把它們一起送入虛擬機。

我之前說把顯示卡送進虛擬機裡，其實是把顯示卡所在IOMMU組的全部PCIe設備都送進去。

由於**送入虛擬機的設備不能在宿主機或其他虛擬機上使用**，主機板有較好的IOMMU組是很重要的（例如你總不能把安裝了宿主機OS的NVMe SSD一起送進去吧）。

我的主機板（[技嘉X570S AERO G](https://www.gigabyte.com/tw/Motherboard/X570S-AERO-G-rev-1x)）的IOMMU組接近完美，幾乎所有設備都在不同的IOMMU組別，而且支持PCIe Bifurcation (x8/x8)，十分適合做**Looking Glass**。

要檢查現有主機板的IOMMU組（不需刪除Windows）：

1. 先在BIOS啟用IOMMU。這選項沒有固定名稱，可能是*IOMMU* 、*VT-d* 、*AMD-V* 、*SVM* 等
2. 找個USB寫入[Fedora](https://fedoraproject.org/spins/kde/download)的映像，然後插入電腦，開機進入BIOS並啟動它
{{< notice warning "Intel用家注意" >}}
剛啟動Fedora時應看到這[畫面](./Grub.png)。選擇有`Test this media`的一項並按`E`，然後進入這[畫面](./GrubConfig1.png)。

請在`linux`開頭的那一行的最後加上`intel_iommu=on`（[如圖](GrubConfig2.png)），然後按`F10`啟動Fedora。
{{< /notice >}}

3. 開啟終端程式（KDE的終端是Konsole），執行`nano iommu.sh`
4. 在終端貼上以下內容：

```bash
#!/bin/bash
shopt -s nullglob
for g in $(find /sys/kernel/iommu_groups/* -maxdepth 0 -type d | sort -V); do
    echo "IOMMU Group ${g##*/}:"
    for d in $g/devices/*; do
        if [[ -e "$d"/reset ]]; then
            echo -n "[RESET]"
        fi
        echo -n $'\t'
        echo -e "\t$(lspci -nns ${d##*/})"
    done
done
```

1. 按`CTRL+X => Y => ENTER`以儲存並退出nano
2. 執行`chmod u+x iommu.sh`
3. 執行`./iommu.sh | less`，可看到IOMMU組分佈及硬件有無[Reset功能](#reset-bug)（按上下鍵移動，按`Q`退出）

如果你主機板的IOMMU組分佈不理想（例如兩張顯示卡在同一個IOMMU組內），可以嘗試：

1. 更新BIOS（有機會影響IOMMU組分佈）
2. 將硬件轉插主機板上其他相容的插槽
3. 使用[ACS override patch](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Bypassing_the_IOMMU_groups_(ACS_override_patch))：這個Patch可令全部硬件都有自己一個獨佔既IOMMU組，但用它會帶來安全性風險。請自己斟酌利弊，本文亦不提供安裝教學

如果買新主機板的話，我建議買AMD的X570系。VFIO社群內不少人都說X570系主機板有非常好的IOMMU組分佈，而且不少X570主機板支持PCIe Bifurcation，非常適合**Looking Glass**。買X570系的壞處是不能戰未來：AM4平台不會再有新產品；它們用的DDR4記憶體同樣是夕陽產品。

如果介意以上缺點，可選買Intel或AMD較新的主機板，**但你要自己做功課，在網上找找知道你想買的主機板的IOMMU組**： 你可以到[VFIO Reddit](https://www.reddit.com/r/VFIO/)、[VFIO Discord](https://discord.gg/f63cXwH)等地方看看。

#### Reset功能

如果你未買*虛擬機卡* ，我建議你買NVIDIA的顯示卡，因為Intel和AMD的顯示卡可能有*Reset bug* 。

所謂*Reset bug* 即是硬件沒有Reset功能，**無法在虛擬機關機時正確地重置**，使其處於一個"假死"狀態。在這個狀態下的硬件會令你不能重新啟動**VFIO**虛擬機，必須將整個宿主機重啟才能再次啟動它。

上部分檢查IOMMU組的腳本可同時檢查硬件有沒有Reset功能。如果你的AMD顯示卡沒有Reset功能，可以看看[Vendor Reset](https://github.com/gnif/vendor-reset)支不支持你的顯示卡，它可為部分AMD顯示卡添加Reset功能。

（AMD連企業用的AI運算顯示卡都沒有Reset功能，令一眾企業客戶大呼中伏。但據說情況[正在](https://www.reddit.com/r/Amd/comments/1bsjm5a/letter_to_amd_ongoing_amd/)[改善](https://forum.level1techs.com/t/the-state-of-amd-rx-7000-series-vfio-passthrough-april-2024/210242)）

#### 顯示卡選擇

上面提及*虛擬機卡* 推薦使用NVIDIA：Windows驅動程式穩定、有Reset功能；缺點只有貴:money_with_wings:

*宿主機卡* 推薦Intel或AMD（CPU內顯或獨立顯示卡），因為這兩個牌子的顯示卡在Linux有開源及穩定的驅動程式，此外它們支持*DMABUF* 功能，這對Looking Glass的性能有大幫助。NVIDIA在Linux上的開源驅動程式性能較差，而官方閉源的驅動程式可能不支持*DMABUF* 。

如果打算用Looking Glass，開發者建議兩張獨立顯示卡。CPU內顯也可作*宿主機卡* 使用，但Looking Glass的幀數會較低。我建議先安裝Looking Glass，看看能不能接受其幀數，實在太慢的話再買第二張獨立顯示卡。

如果想買*宿主機卡*，我推薦Intel Arc系列（如A310或A380），不但便宜、耗電低，更有極強編碼/解碼能力，非常適合OBS用家。

此外，你的**螢幕要有至少兩個插口**，每張顯示卡分別插一個插口。要注意插口的規格，例如你螢幕只有VGA插口，但顯示卡又只有HDMI/DP插口的話，那你就要換螢幕或顯示卡其中一個了。

#### CPU

因為要至少預留一核/兩線程給宿主機（用Looking Glass的話要留至少兩核/四線程），所以CPU不能太弱。

如果單純VFIO，我建議至少六核/十二線程起步，例如Intel i5-12400/AMD 5600X。

如果要用Looking Glass，我建議至少八核/十六線程起步，例如AMD 5700X。（我個人使用AMD 5900X）

以上的建議都是假設買全大核CPU。如果你的CPU是大小核設計（例如近年Intel的P-core/E-core設計），VFIO設定上可能較麻煩。

#### 其他硬件

除了顯示卡外，你還可能會傳入其他硬件，最有可能的是**USB控制器**和**NVMe SSD/SATA控制器**。

請注意傳入的硬件的IOMMU組，還有就是它們有沒有Reset功能。

##### USB控制器

你可能需要將USB設備傳入**VFIO**虛擬機（比如Xbox控制器）。將單個USB設備傳入虛擬機**不需考慮IOMMU或Reset問題**，如能正常使用則再好不過。

但如果你如此傳入去的設備有問題（例如有輸入延遲或經常斷連），我建議你將整個USB控制器傳入去。

注意**一個USB控制器通常控制多於一個USB插槽**。將控制器傳入後，**VFIO**虛擬機就能直接控制這些USB插槽上的設備，應能解決絕大部分USB相關問題。

**傳入USB控制器要注意IOMMU和Reset問題**。你可以用這[Python腳本](./usb_iommu)在Linux上檢查USB插槽屬於哪個USB控制器，以及該USB控制器屬於哪個IOMMU組。(註：這腳本只能檢測已插入設備的USB插槽)

##### NVMe SSD及SATA控制器

**VFIO**虛擬機可以安裝在虛擬硬碟上，又或者可以直接安裝在其他儲存裝置上（例如NVMe SSD或SATA SSD/HDD）並將其控制器傳入虛擬機：

選擇前者的好處是不需要買額外的儲存裝置，此外可以直接將整個虛擬硬碟做快照及備份。

選擇後者的好處是**可以Dual boot**（進入BIOS選擇安裝Windows的儲存裝置並啟動即可）。如果你有兩個（控制器不相同）的儲存裝置，而其中之一本來就安裝了Windows，那就可以將Linux安裝在另一儲存裝置上，然後把安裝了Windows的儲存裝置之控制器傳入虛擬機。這樣虛擬機就可**直接使用此儲存裝置上的Windows**，不需花時間重新安裝。

如果你選擇後者，你要把對應的NVMe控制器（如使用NVMe SSD）或SATA控制器（如使用SATA SSD/HDD）傳入虛擬機。注意**一個SATA控制器通常控制多於一個SATA插口**，NVMe就通常是一個控制器對一個SSD。

### 小結

以上就是**VFIO**/**Looking Glass**的硬件方面的注意事項。

因為實在太長，我把**VFIO**虛擬機和**Looking Glass**的安裝教學放在了[下一篇文章](../007_simple_guide_for_vfio_2/)。
