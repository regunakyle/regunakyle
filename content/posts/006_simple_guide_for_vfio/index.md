+++
title = "如何實現VFIO及Looking Glass"
author = "Eric Leung"
description = "Guide for setting up VFIO and Looking Glass"
date = "2024-09-26"
+++

{{< css "/css/chinese.css" >}}

（本文最後更新時間：2024年5月26日）

## 前言

自從上次寫有關**VFIO**的文章已差不多有一年時間，這段時間內我使用VFIO虛擬機玩遊戲沒有遇到過問題，十分穩定，我對此非常滿意。

（不知道甚麼是VFIO/Looking Glass的讀者可讀我[介紹VFIO的文章](../002_windows_to_linux/)）

最近發生了三件事，令我決定重裝Linux：

1. Fedora推出了第40版，同時也為桌面環境KDE帶來了大更新
2. 我要把原本用作安裝Windows 10虛擬機的SSD轉讓給家人
3. Looking Glass推出了B7版（現時仍是Release Candidate版），據說性能上升不少，

藉此機會把自己安裝**VFIO**虛擬機的步驟記下來，希望能幫助其他有興趣的人。

如果你想轉用Linux，但又不想放棄Windows平台上遊戲/生產力軟件，這篇文章應該非常適合你。

## 如何實現

在讀以下內容前，要注意以下事項：

1. 先去找找自己最常玩的遊戲是否支持虛擬機或Linux：例如最近英雄聯盟（League of Legends）就宣佈不再支持Linux及虛擬機。如果不支持，你就只能透過Dual boot玩這些遊戲
2. 本文的安裝步驟只在Fedora 40 KDE上執行過，不一定適用於其他Linux發行版（Distribution）
3. 本文假設你的電腦**有至少兩張顯示卡**（CPU內顯或獨立顯示卡都可），不考慮只有單一顯示卡的情況

下文以「虛擬機卡」代指傳入虛擬機的顯示卡，「宿主機卡」代指宿主機使用的顯示卡。

{{< notice warning "單顯示卡" >}}
單顯示卡仍可設定**VFIO**虛擬機，不過設定上更麻煩，我也沒做過，所以不作說明。

注意**Looking Glass**要求至少兩張顯示卡。

 {{< /notice >}}

{{< figure src="./PC.jpg" caption="我的電腦配置" >}}

### 硬件選擇

[Looking Glass硬件要求](https://looking-glass.io/docs/B7-rc1/requirements/)

#### 主機板IOMMU

**VFIO**最看重的是主機板的IOMMU組：一個IOMMU組是可以傳入虛擬機的**最小物理設備集合**。

我之前說把顯示卡送進虛擬機裡，其實是把顯示卡所在IOMMU組的全部PCIe設備都送進去。

任何插在主機板上PCIe設備都被分配在一個IOMMU組，如果有多個設備被分配到一個IOMMU組裡，你就只能把它們一起送入虛擬機。

由於**送入虛擬機的設備不能在Linux上使用**，主機板有較好的IOMMU組是很重要的（你總不能把安裝了Linux的NVMe SSD一起送進去吧）。

我的主機板（[技嘉X570S AERO G](https://www.gigabyte.com/tw/Motherboard/X570S-AERO-G-rev-1x)）的IOMMU組接近完美，幾乎所有設備都在不同的IOMMU組別，而且支持PCIe Bifurcation (x8/x8)，十分適合做**VFIO**和**Looking Glass**。

要檢查現有主機板的IOMMU組（不需安裝Linux）：

1. 先在BIOS啟用IOMMU。這選項有很多不同稱呼（例如IOMMU/VT-d/AMD-V/SVM等），請自己找找看
2. 找個USB寫入[Fedora](https://fedoraproject.org/spins/kde/download)的映像，然後插入電腦，開機進入BIOS並啟動它
{{< notice warning "Intel用家注意" >}}
剛啟動Fedora時應看到這[畫面](./Grub.png)。選擇有`Test this media`的一項並按`e`，然後進入這[畫面](./GrubConfig1.png)。

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
        if [[ -e "$d"/reset ]]; then echo -n "[RESET]"; fi
        echo -n $'\t'
        echo -e "\t$(lspci -nns ${d##*/})"
    done
done
```

5. 按`ctrl+x` => `y` => `enter`以儲存並退出nano
6. 執行`chmod u+x iommu.sh`
7. 執行`./iommu.sh | less`，可看到IOMMU組分佈及硬件有無[Reset功能](#reset-bug)（按上下鍵移動，按`q`退出）

如果你主機板的IOMMU組分佈不理想（例如兩張顯卡在同一個IOMMU組內），可以嘗試：

1. 更新BIOS（有機會影響IOMMU組分佈）
2. 將硬件轉插主機板上另一個PCIe/M.2插槽
3. 使用**ACS override patch**：這個Patch可令全部硬件都有自己一個獨佔既IOMMU組，但用它會帶來安全性風險。請自己斟酌利弊，本文亦不提供安裝教學

如果買新主機板的話，我建議買AMD的X570系。VFIO社群內不少人都說X570系主機板有非常好的IOMMU組分佈，而且不少X570主機板支持PCIe Bifurcation，非常適合**Looking Glass**。買X570系的壞處是不能戰未來：AM4平台不會再有新產品；它們用的DDR4記憶體同樣是夕陽產品。

如果介意以上缺點，可選買Intel或AMD較新的主機板，**但你要自己做功課，在網上找找知道你想買的主機板的IOMMU組**： 你可以到[VFIO Reddit](https://www.reddit.com/r/VFIO/)、[VFIO Discord](https://discord.gg/f63cXwH)等地方看看。

#### Reset功能

如果你未買虛擬機卡，我建議你買Nvidia的顯示卡，因為Intel和AMD的顯示卡可能有"Reset bug"。

所謂"Reset bug"即是硬件沒有Reset功能，無法在虛擬機關機時正確地重置，使其處於一個"假死"狀態。在這個狀態下的硬件會令你不能重新啟動VFIO虛擬機，必須將整個宿主機重啟才能再次啟動它。

上部分檢查IOMMU組的腳本可同時檢查硬件有沒有Reset功能。如果你的AMD顯示卡沒有Reset功能，可以看看[Vendor Reset](https://github.com/gnif/vendor-reset)。

（AMD連企業用的AI運算顯示卡都沒有Reset功能，令一眾企業客戶大呼中伏。不過據說情況[正在改善](https://www.reddit.com/r/Amd/comments/1bsjm5a/letter_to_amd_ongoing_amd/)）

#### 顯示卡選擇

上面提及虛擬機卡推薦使用Nvidia：Windows驅動程式穩定、有Reset功能；缺點只有貴:money_with_wings:

宿主機卡推薦Intel或AMD（CPU內顯或獨立顯示卡），因為這兩個牌子的顯示卡在Linux有開源的驅動程式，此外它們支持*DMABUF* 功能，這對Looking Glass的性能有大幫助。

如果打算用Looking Glass，開發者建議兩張獨立顯示卡。CPU內顯也能用，但Looking Glass的幀數會較低。我建議先安裝Looking Glass，看看能不能接受其幀數，不能接受再買第二張獨立顯示卡。

如果想買第二張顯示卡，我推薦Intel Arc系列（如A380），不但便宜、耗電低，更有極強編碼/解碼能力，非常適合OBS用家。

此外，你要買多一條HDMI/DisplayPort線，用來連接虛擬機卡和你的螢幕。

#### CPU

因為要至少預留一核/兩線程給宿主機（用Looking Glass的話要留至少兩核/四線程），所以CPU不能太弱。

如果單純VFIO，我建議至少六核/十二線程起步，例如Intel i5-12400/AMD 5600X。

如果要用Looking Glass，我建議至少八核/十六線程起步，例如AMD 5700X。（我個人使用AMD 5900X）

以上的建議都是假設買全大核CPU。如果你的CPU是大小核設計（例如近年Intel的P-core/E-core設計），VFIO設定上可能較麻煩。

#### 其他硬件

除了顯示卡外，你還可能會傳入其他硬件，最有可能的是**USB控制器**和**NVMe SSD/SATA控制器**。

請注意傳入的硬件的IOMMU組，還有就是它們有沒有Reset功能。

{{< underline "USB控制器" >}}

你可能需要將USB設備傳入VFIO虛擬機（比如Xbox控制器）。將單個USB設備傳入虛擬機不需考慮IOMMU或Reset問題，如能正常使用則再好不過。

但如果你如此傳入去的設備有問題（例如有輸入延遲或經常斷連），我建議你將整個USB控制器傳入去。

一個USB控制器**通常控制一個或以上USB插槽**。將控制器傳入後，VFIO虛擬機就能直接控制這些USB插槽上的設備，應能解決絕大部分USB相關問題。

傳入USB控制器要注意IOMMU和Reset問題。你可以用這[Python腳本](./usb_iommu)去檢查USB插槽屬於哪個USB控制器，以及該USB控制器屬於哪個IOMMU組。(註：這腳本只能檢測已插入設備的USB插槽)

{{< underline "NVMe SSD/SATA控制器" >}}

VFIO虛擬機可以安裝在虛擬硬碟上，又或者可以直接安裝在其他存儲裝置上（例如NVMe SSD或SATA SSD/HDD）並將之傳入虛擬機：

選擇前者的好處是不需要買額外的存儲裝置（廢話），此外可以直接將虛擬硬碟做備份（因為虛擬硬碟本質上只是一個檔案）。

選擇後者的好處是**可以Dual boot**（進入BIOS選擇安裝Windows的存儲裝置並啟動即可）。此外，如果你傳入的是NVMe SSD，其理論讀寫性能上限會比同樣在NVMe SSD上的虛擬硬碟高。（但對遊戲玩家而言虛擬硬碟的性能已足夠）

如果你選擇後者，你要把對應的NVMe控制器（如使用NVMe SSD）或SATA控制器（如使用SATA SSD/HDD）傳入虛擬機。注意一個SATA控制器**通常控制多於一個SATA插口**，NVMe就通常是一個控制器對一個SSD。

### VFIO虛擬機及Looking Glass設定

此處假設你的電腦已經安裝最新版本的Fedora（現時是40）。

我強烈建議以下內容配合[Arch Wiki上的教學](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF)一並服用，可以相互參照。

我的設定可能和Arch Wiki上的有出入，因為我參考了[VFIO Discord](https://discord.com/invite/f63cXwH)內的Linux高手們較新的建議。你可以一同入去研讀及發問再作決定。

{{< notice warning "Intel用家注意" >}}

Intel平台上IOMMU需要以下步驟才能啟動：

1. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`intel_iommu=on`，然後儲存
2. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg`，然後重啟電腦
3. 重啟後執行上方檢查IOMMU組的腳本，如看到硬件的IOMMU組則成功

{{< /notice >}}

#### 綁定vfio-pci/pci-stub驅動程式

*vfio-pci* 是一個VFIO專用驅動程式。綁定*vfio-pci* 的硬件不會使用正常的驅動程式（比如顯示卡的官方驅動），因此宿主無法使用這些硬件。這樣能最大程度上保證VFIO虛擬機傳入硬件的穩定性。

1. 執行上方檢查IOMMU組的腳本，記下你想傳入虛擬機的設備ID（應是`xxxx:xxxx`格式，例如我的3060 Ti的ID是`10de:2489`）
2. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`vfio_pci.ids=<Device 1 ID>,<Device 2 ID>`（請自行填入設備ID），然後儲存
3. 執行`sudo nano /etc/dracut.conf.d/vfio.conf`，貼上以下內容後儲存：

```bash
add_drivers+=" vfio vfio_iommu_type1 vfio_pci vfio_pci_core " 
force_drivers+=" vfio_pci "
```

4. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg` 及 `sudo dracut -fv`，然後重啟電腦
5. 重啟後輸入`lspci -nnk`，應看到想傳入虛擬機的設備有`Kernel driver in use: vfio-pci`。

有些硬件不能用以上方法綁定*vfio-pci* ，例如USB控制器和SATA控制器。因為這兩種硬件的驅動程式（USB是*xhci_hcd* 、SATA是*ahci* ）綁定優先度更高，*vfio-pci* 來不及綁定硬件。

這時候可以轉用*pci-stub* ：它是*vfio-pci* 的前身，功能和*vfio-pci* 相近，但綁定優先度比*xhci_hcd* 和*ahci* 更高。它的缺點是它沒有*vfio-pci* 的一些功能（例如*vfio-pci* 可以把你的硬件設置成耗電較低的休眠狀態）。

1. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`pci-stub.ids=<Device 1 ID>,<Device 2 ID>`（請自行填入設備ID），然後儲存
2. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg`，然後重啟電腦
3. 重啟後輸入`lspci -nnk`，應看到想傳入虛擬機的設備有：`Kernel driver in use: pci-stub`。

不過也不一定要綁定*pci-stub* ：我自己就有一個USB控制器照常使用*xhci_hcd* ，VFIO虛擬機啟動時Linux會自動把*xhci_hcd* 換成*vfio-pci* ，虛擬機關機後又會換回*xhci_hcd* ，這樣做我沒遇到甚麼問題。

注意：我不知道SATA控制器（或其他*vfio-pci* 綁定不了的硬件）不綁定*pci-stub* 的話會不會有問題，這個要留給其他用家自己研究了。

#### 創建VFIO虛擬機

1. 執行`sudo dnf install -y @virtualization`
2. 下載Windows 10的ISO檔和[此處](https://github.com/virtio-win/virtio-win-pkg-scripts?tab=readme-ov-file#downloads)的`Latest virtio-win ISO`，並將它們移至`/var/lib/libvirt/images`（用`cp`或`mv`指令都可）
3. 啟動*virt-manager* ，並啟用設定：*Edit* => *Preferences* => *Enable XML editing*
4. 創建新的虛擬機（左上角按鍵），安裝ISO選擇你第2步下載的Windows 10 ISO檔，選擇後於下方`Choose the operation system you are installing`中選`Microsoft Windows 10`
5. 設定CPU及RAM
6. 在*virt-manager* 設定虛擬硬碟那一頁，取消選擇`Enable storage for this virtual machine`
7. 最後一頁緊記按`Customize configuration before install`，然後按`Finish`

{{< figure src="./VirtManagerUI.png" caption="這時應出現這個介面" >}}

#### 設定VFIO虛擬機XML

1. 在`Overview`頁，`Firmware`選擇`UEFI`。我建議將虛擬機改個獨特的名字（如`vfio-win10`），避免將來創建其他Windows 10虛擬機產生混亂
2. 在`CPU`頁

### Looking Glass設定

a

### 雜項

rotate VM

### 結語

a
