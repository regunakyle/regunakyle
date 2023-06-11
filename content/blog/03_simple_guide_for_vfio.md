+++
title = "如何實現VFIO及Looking Glass"
author = "Eric Leung"
description = "Guide for setting up VFIO and Looking Glass"
date = "2099-06-04"
+++

## 如何實現

以下開始講講如何實現這些技術：

### 硬件選擇

[我的電腦硬件配置](https://pcpartpicker.com/list/yrVyv3)

**VFIO**最看重的是主機板的IOMMU組。一個IOMMU組是可以傳遞給虛擬機的最小物理設備集合，我們上面說把GPU送進虛擬機裡，實際上是把GPU所在的IOMMU組的全部設備都送進去。任何插在主機板上PCIe設備都被分配在一個IOMMU組，如果有多個設備被分配到一個IOMMU組裡，你就只能把它們一起送進虛擬機了。

由於送進去虛擬機的設備在Linux上不能使用，主機板有較好的IOMMU組是很重要的（你總不能把安裝了Linux的SSD和GPU一起送進去吧）。我的主機板（技嘉X570S AERO G）的IOMMU組接近完美，幾乎所有設備都在不同的IOMMU組別，所以十分適合做**VFIO**。

AMD的X570主機板是已知IOMMU組較好的。Intel的主機板也可，**但你要自己做功課，找找有沒有其他人分享你想買的主機板的IOMMU組**： 你可以到[VFIO Reddit](https://www.reddit.com/r/VFIO/)、[VFIO Discord](https://discord.gg/f63cXwH)及[Linux Hardware](https://linux-hardware.org/)等地方看看。

要檢查現有主機板的IOMMU組，首先要**在BIOS啟用IOMMU**，這選項可能有很多名字（VT-d／AMD-V／SVM），請自己研究。然後找個USB安裝Fedora的Live Image（據說用Arch Linux的也可）

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
