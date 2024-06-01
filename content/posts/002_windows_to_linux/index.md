+++
title = "從Windows到Linux：VFIO及Looking Glass介紹"
author = "Eric Leung"
description = "Better than dual boot, really"
categories = ["VFIO/Looking Glass系列"]
date = "2023-06-11"
+++

{{< css "/css/chinese.css" >}}

## 前言

作為一個IT從業員:technologist:，工作上必然會多多少少接觸到Linux。

我一直都有興趣轉用Linux，**遊戲是我留在Windows的唯一原因**：Linux對遊戲的支援遠遠不及Windows。

近年Steam母公司Valve努力研發Proton（[WINE](https://www.winehq.org/)的遊戲用分支），目標是令只能在Windows運行的遊戲能在Linux上高效能及低延遲地運行。

Proton現時已支持[相當多數目](https://www.protondb.com/)的遊戲。可惜的是**它不能保證對新遊戲的支持**，而且還可能有各種Bug。老實說工作已經消耗我很多精力了，回家後還是希望遊戲能即開即玩。

{{< figure src="./SteamDeck.jpg" caption="借同事的Steam Deck試玩，體驗相當不錯:thumbsup:" >}}

## 轉用Linux的契機

直至半年前我依然如常用著Windows。有一天我看到了以下兩條介紹**VFIO**的影片：

{{< youtube w473rRf9aYA >}}
\
{{< youtube Ol9O3Jow740 >}}

\
我看完後禁不住嘆﹕這麼厲害？在Linux上用Windows虛擬機玩遊戲，而且還有接近原生Windows的硬件表現？
這不就是我想要的完美解決方案嗎？:star_struck:

自然我馬上開始研究，前前後後花了一個月時間，總算把我的理想PC組出來了。到現在有半年時間，這段時間內我*沒有直接啟動過Windows*。

遊戲在虛擬機上運行順暢，沒有明顯輸入延遲，實在令我非常滿意。

{{< figure src="./Cover.jpg" caption="左邊是Windows（**Looking Glass**），右邊是Linux" >}}

## 解決方案

**VFIO**這解決方案基本上可以理解為雙系統（Dual Boot）的完美替代。

它用途不止於遊戲，也適用於只能在Windows上用的生產力軟件（比如各類Adobe軟件及MS Office），
不過要注意的是這方案對你的電腦硬件有特別需求（很有可能要換硬件），也要求你有一定Linux知識。

此外，有些線上遊戲的反作弊系統會禁止遊戲於虛擬機上運行，只能透過Dual Boot解決（或嘗試欺騙反作弊系統，但有風險，本文亦不提供教學）。萬幸的是Dual Boot和VFIO並不衝突。

以下列出一些已知反虛擬機的遊戲﹕

- 特戰英豪（Valorant）
- 虹彩六號：圍攻行動（Tom Clancy's Rainbow Six Siege）
- 逃離塔科夫（Escape from Tarkov）
- 原神（Genshin Impact）

我個人是純單機遊戲玩家，所以不用考慮這問題。但如果你喜歡玩線上遊戲，進入這個坑之前還是先做好功課。

以下簡單介紹**VFIO**及**Looking Glass**：

### VFIO

[VFIO](https://docs.kernel.org/driver-api/vfio.html)（Virtual Function I/O）容許使用者空間進程及虛擬機能直接存取電腦硬件，讓虛擬機也能享有接近原生的硬件表現。

很多虛擬機的顯示卡都是模擬出來的（畢竟虛擬機能顯示畫面就足夠了），透過**VFIO**可把實體顯示卡送入虛擬機。除了顯示卡外，還能把網卡、USB控制器、SSD、SATA控制器（自組NAS福音）及CPU內顯等等都送進去，由虛擬機直接控制這些硬件，並能獲得硬件的最佳性能。

要注意的是當顯示卡被用作VFIO後便不能在Linux上用了，所以需要另一張顯示卡（CPU內顯或另一張獨立顯示卡）讓Linux能顯示畫面，否則Linux只能顯示純命令行。

{{< figure src="./BareMetal.jpg" caption="實機Windows下的3DMark跑分" >}}

\
{{< figure src="./VFIO.jpg" caption="VFIO下的3DMark跑分，可見與實機表現十分接近" >}}

{{< notice info "CPU 分數較低原因" >}}
上圖Windows虛擬機比起實機少了一核（兩線程），所以CPU分數較低。
 {{< /notice >}}

### Looking Glass

[Looking Glass](https://looking-glass.io/)是**VFIO**的延伸。

**VFIO**因為把你指定的顯示卡送給了Windows虛擬機，用家需要另外連接這顯示卡和螢幕，然後切換螢幕的輸入源才能看到虛擬機的畫面。如果你只有一個螢幕，那麼同一時間就只能看到Linux或Windows虛擬機其一的畫面。

**Looking Glass**能解決這個問題：它將Windows虛擬機的原生未壓縮影像極低延遲地投射到Linux上。這樣就無需切換輸入源，可以一鍵切換操作Linux及Windows虛擬機。

此外還有其他功能，例如將Linux的麥克風輸入送至虛擬機內，或是將Linux及虛擬機的剪貼簿同步等等。另外也有官方OBS插件，讓**Looking Glass**的影像直接輸出至OBS上，這樣就能同時實況Linux和Windows虛擬機的畫面。

要注意的是，**Looking Glass**對硬件的要求比**VFIO**更高：開發者推薦**用兩張獨立顯示卡**和預留CPU至少兩核（四線程）給Linux。此外，**Looking Glass**亦會對送入虛擬機的顯示卡會產生一定負荷，所以**其性能會有一定程度下降**（我顯示卡跑分低了10％）。

我會選擇用**Looking Glass**是因為我經常在使用Windows虛擬機時快速切換至Linux去做其他事情，沒有它的話我就要不斷手動切換螢幕的輸入源了。

{{< figure src="./LookingGlass.jpg" caption="Looking Glass下的跑分" >}}

#### Looking Glass的替代方案

另外說一下，**Looking Glass**並非是將Windows虛擬機畫面投射到Linux的唯一方法：

最近我看到一種做法是在虛擬機安裝[Sunshine](https://github.com/LizardByte/Sunshine)，然後在Linux上用[Moonlight](https://github.com/moonlight-stream/moonlight-qt)進行即時畫面實況及互動。這兩個軟件是雲端遊戲的DIY版，剛好可以用來取代**Looking Glass**的功能。

[Parsec](https://parsec.app/)是另一款即時畫面實況解決方案，同樣在Linux及虛擬機安裝即可，但這軟件是閉源的。

即時畫面實況的好處是不需第二張獨立顯示卡（CPU內顯就夠用了），但畫面質素可能較差（畢竟是實況，必須做壓縮；**Looking Glass**沒有做任何壓縮）。

## 結語

不得不說我在實現**VFIO**的過程中有很多得著，比如說如何選擇電腦硬件，或是在Linux用指令行、如何設定虛擬機等，這些對我工作及家用伺服器這興趣都有很多幫助。:ok_man:

雖然這些技術聽起來很厲害，但我不會特意向朋友做推薦。這是因為入門門檻不低：可能要為它特意買/換硬件，而且要學習的東西也不少。最重要的是很多人已經習慣了Windows，不會滿意Linux「半桶水」的桌面使用體驗。

但如果你和我一樣**喜歡折騰**:mechanic:，對Linux感興趣，又有自學能力和耐心的話，不妨研究一下**VFIO**：它可能就是讓你脫離Windows的最佳方案。

如有時間，我會另外寫一篇文章說明如何實現**VFIO**及**Looking Glass**。

（2024年6月更新：文章寫好了，在[這裡](../006_simple_guide_for_vfio_1/)！）

## 延伸閱讀

- [Arch Wiki上的VFIO教學](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF)
- [VFIO Reddit](https://www.reddit.com/r/VFIO/)
- [VFIO Discord](https://discord.com/invite/f63cXwH)
- [Looking Glass Discord](https://discord.com/invite/52SMupxkvt)
