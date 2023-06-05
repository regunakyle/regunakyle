+++
title = "從Windows到Linux: VFIO及Looking Glass介紹"
author = "Eric Leung"
description = "Better than dual boot, really"
date = "2023-06-04"
+++

（本文最後更新時間：2023年6月4日）

## 前言

作為一個IT從業員，工作上必然會多多少少接觸到Linux：無論是作為伺服器OS或是Docker容器的輕量載體，Linux都比其他主流OS做得更出色。
可是Linux在個人電腦中的使用率卻遠比其他兩大對手（Windows／MacOS）低。個人覺得主要是因為Linux對各類桌面用硬件和軟件的支持都不及其他OS。
我一直都有興趣轉用Linux，**遊戲是我留在Windows的唯一原因**：Linux對遊戲的支援遠遠不及Windows。

近年Steam母公司Valve努力研發Proton（[WINE](https://www.winehq.org/)的遊戲用分支），目標是令只能在Windows運行的遊戲能在Linux上高效能及低延遲地運行。
 為此更推出了震撼遊戲界的[Steam Deck](https://www.steamdeck.com/)遊戲掌機 ，上面運行的是Valve基於Arch Linux研發的SteamOS，專為Proton運行遊戲而設。

Proton現時已支持[相當多數目](https://www.protondb.com/)的遊戲。可惜的是**它不能保證對新遊戲的支持**，而且還可能有各種Bug或輸入延遲問題。
老實說工作已經消耗我很多精力了，回家後還是希望遊戲能即開即玩。

{{< figure src="/images/blog/02/SteamDeck.jpg" caption="借同事的Steam Deck試玩，體驗相當不錯" >}}

## 轉用Linux的契機

直至半年前我依然如常用著Windows。有一天我看到了以下兩條介紹**VFIO**的影片：

{{< youtube w473rRf9aYA >}}
\
{{< youtube Ol9O3Jow740 >}}

\
我看完後禁不住嘆﹕**VFIO**實在是太厲害了！在Linux上用Windows虛擬機玩遊戲，而且還有接近原生Windows的硬件表現？
這不是對我這種人來說的完美解決方案嗎？自然我馬上開始研究，前前後後花了一個月時間，總算把我的理想PC組出來了。

到現在已用了半年，這段時間我*沒有直接啟動過Windows*。遊戲在虛擬機上運行順暢，沒有明顯輸入延遲，實在令我非常滿意。

{{< figure src="/images/blog/02/VFIO.jpg" caption="左邊是Windows（**Looking Glass**），右邊是Linux" >}}

## 解決方案

**VFIO**這解決方案基本上可以理解為雙系統（Dual Boot）的完美替代。

它用途不止於遊戲，也適用於只能在Windows上用的生產力軟件 （比如各類Adobe軟件及MS Office），
不過要注意的是這方案對你的電腦硬件有特別需求（很有可能要換硬件），也要求你有一定Linux知識（至少要懂去用命令行）。

此外，有些線上遊戲的反作弊系統會禁止遊戲於虛擬機上運行， 只能透過Dual Boot解決（或嘗試欺騙反作弊系統，但有風險，本文亦不提供教學）。萬幸的是Dual Boot和VFIO並不衝突。
以下列出一些已知反虛擬機的遊戲﹕

- 特戰英豪 （Valorant）
- 虹彩六號：圍攻行動 （Tom Clancy's Rainbow Six Siege）
- 逃離塔科夫 （Escape from Tarkov）
- 原神 （Genshin Impact）

我個人是純單機遊戲玩家，所以不用考慮這問題。但如果你喜歡玩線上遊戲，進入這個坑之前還是先做好功課。

先簡單講解一下本文的兩個主角：**VFIO**和**Looking Glass**﹕

### VFIO

[VFIO](https://docs.kernel.org/driver-api/vfio.html)（Virtual Function I/O）容許使用者空間進程及虛擬機能直接存取電腦硬件， 讓虛擬機也能享有接近原生的硬件表現。

很多虛擬機的GPU都是模擬出來的（畢竟虛擬機能顯示就足夠了）， **VFIO**則是真正意義上把整個GPU送給虛擬機。除了GPU外，還能把網卡、USB控制器（注意不是USB）、SSD、SATA控制器（自組NAS福音）及CPU內顯等等都送進去， 藉此虛擬機能獲得硬件的最佳性能。

要注意的是當GPU被用作VFIO後便不能在Linux上用了， 所以需要另一張GPU（CPU內顯或另一張獨立GPU）讓Linux能顯示畫面， 否則Linux只能顯示純命令行。

### Looking Glass

[Looking Glass](https://looking-glass.io/) 則是**VFIO**的延伸。

**VFIO**因為把你指定的GPU送給了Windows虛擬機，用家需要另外連接這GPU和螢幕，然後切換螢幕的輸入源 （Input Source） 才能看到虛擬機的畫面。如果你只有一個螢幕，那麼同一時間就只能看到Linux和Windows虛擬機其一的畫面。

**Looking Glass**能解決這個問題： 它將Windows虛擬機的原生未壓縮影像低延遲地投射到Linux上。 這樣做就無需切換輸入源， 可以一鍵切換操作Linux及Windows虛擬機。 此外還有其他功能， 例如將Linux的麥克風輸入送至虛擬機內， 或是將Linux及虛擬機的剪貼簿同步等。 要注意的是**Looking Glass**對硬件的要求比**VFIO**更高（**必須要有兩張獨立GPU才能順暢使用**）。

另外說一下， **Looking Glass**並非是將Windows虛擬機畫面投射到Linux的唯一方法：

最近我看到一種做法是在虛擬機安裝[Sunshine](https://github.com/LizardByte/Sunshine)， 然後在Linux上用[Moonlight](https://github.com/moonlight-stream/moonlight-qt)進行即時畫面實況及互動。 這兩個軟件是雲端遊戲的DIY版， 剛好可以用來取代**Looking Glass**的功能。[Parsec](https://parsec.app/)是另一個的即時畫面實況解決方案， 同樣在Linux及虛擬機安裝即可， 但這軟件是閉源的。

即時畫面實況的好處是不需第二張獨立GPU（CPU內顯就夠用了）， 但延遲會比**Looking Glass**高， 畫面質素可能較差（畢竟是實況；**Looking Glass**沒有做任何壓縮）。

## 如何實現

以下開始講講如何實現這些技術：

### 硬件選擇

**VFIO**最看重的是主機板的IOMMU grouping

1. IOMMU grouping主機板 (ACS Override Patch), X570 known to work
2. 雙GPU, VFIO iGPU+dGPU, Looking Glass 雙dGPU (-> ATX), Looking Glass Nvidia+Intel
3. 顯示屏
4. 雙卡Laptop
5. 雙SSD

<https://pcpartpicker.com/list/j6jqv3>

Distro選擇

1. Fedora (建議)
2. Arch Linux

我setup的簡單步驟如下：

1. 安裝Fedora及所需package （建議安裝有用package
2. Setup IOMMU, VFIO-PCI driver
3. (KDE) SDDM問題
4. Setup Windows VM (hint dynamic hook for machine learning), CPU pinning, AMD topoext, RESET gotcha
5. 於Windows安裝VirtIO-Guest-Tools

以上是VFIO,以下是Looking Glass

1. 安裝dependency及build Looking Glass Client, 可選用toolbox/distrobox
2. （可選）安裝OBS Module，放至OBS指定directory
3. （可選）安裝KVMFR, selinux audit
4. 於Windows安裝Looking Glass Host
5. （可選）於Windows安裝Nvidia-Patch並啟用NvFBC

如此安裝完成後，我也能玩Windows遊戲。強烈推薦！

如果你也對VFIO或Looking Glass感興趣的話，可以看看以下連結：

VFIO
<https://vfio.blogspot.com/2015/05/vfio-gpu-how-to-series-part-1-hardware.html>
<https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF>
[VFIO Discord]()

Looking Glass
<https://looking-glass.io/docs/B6/>
[Looking Glass Discord]()
