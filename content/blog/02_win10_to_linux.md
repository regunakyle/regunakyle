+++
title = "Join Linux: VFIO及Looking Glass介紹"
author = "Eric Leung"
description = ""
date = "2024-04-16"
+++

（本文最後更新時間：2023年4月16日）

(注意：文題沒有打錯字)

作為一個IT從業員，工作上必然會多多少少接觸到Linux：無論是作為伺服器OS或是Docker容器的輕量載體，Linux在編程世界是必不可少的工具。
可是Linux在個人電腦中的使用率卻遠比其他兩大對手（Windows／MacOS）低。個人覺得主要是因為Linux對各類桌面用硬件和軟件的支持都不及其他OS。

對我來說，Linux最致命的是對Nvidia顯示卡和各類遊戲的支援都遠不及Windows。尤其是Windows支持WSL2的現在，

近年Steam母公司Valve努力研發Proton（可以簡單理解作Windows模擬器），但新遊戲出時非一定支持＋表現好
（早前借同事的Steam Deck試玩，體驗相當不錯，輸入延遲非常低。有錢的話我也想入手一部）

直至半年前我依然用著，直到有一天我看到了以下兩個影片：

{{< youtube w473rRf9aYA >}}

{{< youtube Ol9O3Jow740 >}}

我看完後，實在是太厲害了！在Linux用Windows VM來玩遊戲，而且還有接近原生Windows的硬體表現？
（其實主要是太清閒，有side project消磨時間

在此簡單講解一下：VFIO, dual boot

[Looking Glass]()則是VFIO的延伸，對硬件的要求比VFIO更高

即使如此，還是有遊戲是不支持，如Anti-Cheat遊戲 e.g. valorant

硬件選擇

1. IOMMU grouping主機板 (ACS Override Patch), X570 known to work
2. 雙GPU, VFIO iGPU+dGPU, Looking Glass 雙dGPU (-> ATX), Looking Glass Nvidia+Intel
3. 顯示屏
4. 雙卡Laptop
5. 雙SSD

<https://pcpartpicker.com/list/j6jqv3>

我setup的簡單步驟如下：

1. 安裝Fedora及所需package （建議安裝有用package
2. Setup IOMMU, VFIO-PCI driver
3. (KDE) SDDM問題
4. Setup Windows VM (hint dynamic hook for machine learning), CPU pinning, AMD topoext, RESET gotcha
5. 於Windows安裝VirtIO-Guest-Tools
6. (如VFIO) Evdev/USB passthrough

以上是VFIO,以下是Looking Glass

1. 安裝dependency及build Looking Glass Client, 可選用toolbox/distrobox
2. （可選）安裝OBS Module，放至OBS指定directory
3. （可選）安裝KVMFR, selinux audit
4. 於Windows安裝Looking Glass Host
5. （可選）於Windows安裝Nvidia-Patch並啟用NvFBC

如此安裝完成後，我也能玩Windows遊戲。強烈推薦！

如果你也對VFIO或Looking Glass感興趣的話，可以看看以下連結：

<https://arccompute.com/blog/libvfio-commodity-gpu-multiplexing/>

VFIO
<https://vfio.blogspot.com/2015/05/vfio-gpu-how-to-series-part-1-hardware.html>
<https://docs.google.com/document/d/1pzrWJ9h-zANCtyqRgS7Vzla0Y8Ea2-5z2HEi4X75d2Q/>
<https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF>
[VFIO Discord]()

Looking Glass
<https://looking-glass.io/docs/B6/>
<https://forum.level1techs.com/c/software/lookingglass/142>
[Looking Glass Discord]()

Fedora
[Fedora discussion]()
[Fedora Discord]()
Suggest matrix/irc

備註：

Fedora有用Package:

- Flatpak
  - Flathub
  - [Firefox]() 或主力browser
  - [Podman Desktop]()
  - [Discord-screenaudio]()
  - [OBS Studio](), advanced GPU
- DNF
  - RPMFusion
  - [Zsh](), zsh-autosuggestions, zsh-syntax-highlighting
  - ibus-table-chinese-quick
  - distrobox
  - podman-compose
  - VSCode (+code repo), 可用flatpak版+podman dev container
  - second gpu driver (need RPMFusion)
  - btrfs-assistant
