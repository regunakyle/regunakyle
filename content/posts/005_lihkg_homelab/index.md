+++
title = "連登Homelab系列（三）：Homelab常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for homelab"
categories = ["連登Homelab系列"]
date = "2024-01-22"
+++

{{< css "/css/chinese.css" >}}

## [按我返回上一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年2月17日）

{{< figure src="./Cover.jpg" caption="IKEA LackRack - 廉價DIY機櫃" >}}

## 點解要自組NAS？自組有咩好/壞處？

優點：

- :moneybag: 硬件性價比可以大幅拋離任意大牌子NAS（講緊係同性能下可以平40%或以上）
- 硬件選擇自由（例如可以用舊機既料砌，或可根據自己需求購買各類零件；[M.2 10G網卡](https://www.innodisk.com/tw/products/embedded-peripheral/communication/egpl-t101)聽過未）
- 可以學野（Sysadmin或Networking功夫，市場對呢啲技術有需求）

缺點：

- 通常體積大，耗電大
- 要學勁多野，安裝麻煩，要花時間讀文檔（要識英文）
- 維護靠自己（不過通常係安裝完後就唔洗點理）

## 硬件邊到黎？

舊電腦/Laptop、[Raspberry Pi](https://classroomeshop.com/collections/raspberry-pi)或類似產品、二手市場、淘寶、Amazon等。

部分硬件只可能搵到淘寶或國產貨（或外國只有高價代替品），如各式軟路由工控機及細NAS機箱等。

NAS機箱有外國貨（如Fractal Design既[Node系列](https://www.fractal-design.com/products/cases/node/)），不過通常偏大部/貴，想要細部或平啲就要淘寶。

[延伸閱讀：Small Form Factor PC Master List](https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/)

## 用咩硬件去增加主機板SATA插口數？

請睇：[Recommended Controller for Unraid](https://forums.unraid.net/topic/102010-recommended-controllers-for-unraid/)。

[延伸閱讀：TrueNAS reflash LSI card教學](https://www.truenas.com/community/resources/detailed-newcomers-guide-to-crossflashing-lsi-9211-9300-9305-9311-9400-94xx-hba-and-variants.54/)

## 買硬件有咩要注意？

### 預計Server負載買CPU

大部分人個Server**其實85%時間都係Idle**，咁樣既話你買CPU唔係睇Peak consumption而係Idle consumption。

就我所知：Intel及AMD G系列CPU既Idle consumption較低，而AMD非G系列就Idle耗電較高。

但如果係常時都高負載既話，AMD非G系列既能耗比就相當高，值得考慮。

另外：Intel T字尾CPU idle時耗電同普通版差唔多。普通版CPU係BIOS設定功耗牆之後可以做到類似T字尾CPU既效果。

[延伸閱讀：Intel T processors power consumption tests](https://www.reddit.com/r/homelab/comments/189vkss/intel_t_processors_power_consumption_tests/)

### ECC RAM

ECC既用途係偵測RAM有否發生Bit flip，如有就嘗試修正。[（運作原理）](https://youtu.be/zzeuOecdgAI)

如果冇ECC，咁你RAM發生Bit flip時可能咩事都冇，可能令Server死機，最嚴重既情況係造成偵測唔到既資料損毀。

但Bit flip發生機率極低。除非玩到去Data center級數（或者Server係[高輻射地區](https://youtu.be/o3Cx2wmFyQQ)），否則可能十年都遇唔到一次因Bit flip造成既資料損毀。[（測試數據）](https://youtu.be/DAXVSNAj6GM)

問題係雖然ECC RAM本身唔係貴好多，但可以用ECC RAM既主機板/CPU可以貴勁多。尤其是Intel，消費級主機板Chipset全部唔支持ECC，要上到Workstation或Server級Chipset先有。

AMD反而係家用級已經有，所以想要ECC可以先睇AMD（例如[5650G](https://www.amd.com/en/products/apu/amd-ryzen-5-pro-5650g)配X570板，低能耗+多核+ECC+靚IOMMU）。另一個選擇係執二手Server件/洋垃圾（Xeon/Epyc之類），淘寶一堆平價野。

我既諗法係，你要儲存既數據愈多/愈重要，用既RAM量愈大，就愈值得買ECC件。（當買個心安都好）

[延伸閱讀：Will ZFS and non-ECC RAM kill your data？](https://jrs-s.net/2015/02/03/will-zfs-and-non-ecc-ram-kill-your-data/)

{{< notice info "注意事項" >}}

1. ECC RAM有分RDIMM/LRDIMM/UDIMM，要睇清楚塊板支持邊款先至買。
2. DDR5所謂既內置ECC並非真ECC，且不能取代真ECC。
3. ECC唔係靈丹妙藥，如果條RAM本身係壞既話照樣會狂出Error。
{{< /notice >}}

### 主機板IOMMU grouping

如果你想行虛擬機的話，有機會要將Host既PCIe設備Passthrough入虛擬機，例如將CPU內顯送入Jellyfin虛擬機或將SATA controller送入NAS虛擬機。如此送入去既硬件完全由虛擬機控制，可獲得接近無損性能。

要做PCIe passthrough既話，主機板要支持IOMMU，此外亦要注意IOMMU既Grouping。

PCIe passthrough係以一個IOMMU group為單位。一個IOMMU group可以有多過一個硬件，想送某個硬件就要連同佢IOMMU group既其他硬件一齊送入去。

假設你主機板PCIe 1槽、SATA controller及網卡係同一IOMMU group，咁你想送個插咗係PCIe 1槽既硬件（如顯示卡）入虛擬機，就要將SATA controller（連帶硬碟）同網卡都送埋入去。

**Host不能使用任何Passthrough咗入虛擬機既硬件**。

其實有方法呃個Kernel，令佢以為全部硬件都有自己一個獨佔既IOMMU group（關鍵字：ACS patch）。

Proxmox係[Kernel command line加一行](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_isolation)就可以用到呢個Patch。注意用呢個Patch有[安全性風險](https://www.reddit.com/r/VFIO/comments/9jer5r/acs_patch_risk/)。

[延伸閱讀：Script for checking IOMMU group（Arch Wiki）](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Ensuring_that_the_groups_are_valid)

### Host及虛擬機共享Intel CPU內顯

Intel CPU既內顯可以用SR-IOV（12代或以後）或GVT-G（5至10代CPU）方法令Host同虛擬機都用到佢。

**唯獨係11代咩都冇**。如果你Host同虛擬機都要用內顯（例如個Host靠內顯先顯示到野，但虛擬機行Jellyfin要內顯做轉碼）既話要注意。

如果不幸地用緊11代Intel CPU，或唔想搞以上既野，可以轉用LXC或Docker：只要個Host用到個內顯，LXC及Docker都用到。

[延伸閱讀：Intel GVT-G setup（Arch Wiki）](https://wiki.archlinux.org/title/Intel_GVT-g)

[延伸閱讀：12代及以後Intel CPU之SR-IOV方法](https://github.com/strongtz/i915-sriov-dkms)

{{< notice info "Nvidia 顯示卡" >}}
有方法使Host同虛擬機可共享某啲型號既Nvidia顯示卡。

[呢到](https://gitlab.com/polloloco/vgpu-proxmox)有適用於Proxmox既安裝教學。注意30系或以上既顯示卡型號用唔到呢個方法。

{{< /notice >}}

## LXC係咩黎？同Docker/虛擬機有咩唔同？

LXC雖然同Docker一樣係"Container"，**但佢概念上同使用上都更接近虛擬機，係虛擬機既輕量級代替品。**

同虛擬機相似，係LXC上面你係手動裝Service行。另外兩者都支持快照（Snapshot）及備份。

LXC（及Docker）同虛擬機唔同既係佢會同個Host共用Kernel（虛擬機有自己Kernel），所以資源消耗較低。

相對地LXC（及Docker）安全性較虛擬機弱，例如佢地造成Kernal panic時會炸死埋個Host及其他虛擬機，虛擬機Kernal panic只會炸死自己。

此外，因為共用Kernel，如果有軟件要較新版本Kernel既話（如Wireguard要Linux版本5.6或以上），LXC（及Docker）都會行唔到。

Docker同LXC唔同既係Docker通常一個Image淨係會行一隻Service，但LXC你可以係上面裝十幾廿個Service同時行。

Docker係Application級Container：一個Image專行一隻App；LXC係OS級Container：佢提供咗個OS比你，你係上面玩咩都得。

## 用咩OS？

{{< figure src="./Proxmox.png" caption="Proxmox VE介面" >}}

{{< underline "Hypervisor OS" >}}

**[Proxmox VE](https://www.proxmox.com/en/proxmox-virtual-environment/overview)** :thumbsup:、[VMWare ESXi（付費）](https://www.vmware.com/hk/products/esxi-and-esx.html)、[Windows Server + Hyper-V（付費）](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server)、[XCP-NG](https://xcp-ng.org/)

[Hyper-V Server 2019（免費）](https://www.microsoft.com/en-us/evalcenter/evaluate-hyper-v-server-2019)

{{< underline "NAS OS" >}}

[TrueNAS（Core/Scale）](https://www.truenas.com/truenas-community-editions/) :thumbsup:、[Xpenology（黑群輝）](https://xpenology-com.translate.goog/forum/topic/62221-tutorial-installmigrate-to-dsm-7x-with-tinycore-redpill-tcrp-loader/)、[Unraid（付費）](https://unraid.net/)、[OpenMediaVault](https://www.openmediavault.org/)

{{< underline "Server OS" >}}

**[Debian](https://www.debian.org/)** :thumbsup:、[Ubuntu Server](https://ubuntu.com/server)、[CentOS Stream](https://www.centos.org/centos-stream/)、[RHEL（有No-cost subscription）](https://developers.redhat.com/articles/faqs-no-cost-red-hat-enterprise-linux)

{{< underline "Router/Firewall OS" >}}

[pfSense](https://www.pfsense.org/)/[OPNSense](https://opnsense.org/)（x86機推薦）、[OpenWrt](https://openwrt.org/)（家用Router推薦）

{{< notice info "Networking 神器 Openwrt" >}}
一部裝咗OpenWrt既家用Router可以做曬Firewall、Router、Managed Switch（VLAN功能）同Access Point既工作。

而且唔洗買好貴既機，例如[Linksys E8450](https://openwrt.org/toh/linksys/e8450)非常適合OpenWrt，現時[港行](https://www.price.com.hk/product.php?p=478204)都係600蚊左右。

Linux底既OpenWrt支持好多軟件，例如LXC/Docker、Wireguard、[SQM](https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm)等等。你甚至可以用幾部OpenWrt機行[802.11s Mesh Networking](https://openwrt.org/docs/guide-user/network/wifi/mesh/80211s)同[802.11k/v/r 快速漫遊](https://vicfree.com/2022/11/openwrt-wpa3-802.11kvr-ap-setup/)。

如果你岩岩開始玩Homelab，可以先從支持OpenWrt既家用Router入手，有需要時再買獨立Networking硬件。

{{< /notice >}}

## 咩係Hypervisor？點解要用佢？

Hypervisor即專用黎行虛擬機既軟件。上一項提及既Hypervisor OS用既全部都係用Type 1 hypervisor（例如Proxmox用既係[QEMU+KVM](https://zhuanlan.zhihu.com/p/48664113)），虛擬機性能損耗極低，接近原生性能。

用Hypervisor既好處：

- 虛擬機快照及備份（非常實用）
- 可以匯入虛擬機，或匯出虛擬機去另一部Hypervisor
- 提供軟件測試平台
- 有人性化既操作介面，易管理
- 視乎你既硬件，重啟虛擬機可能比重啟實機快勁多

就算你只會用一個虛擬機，都可以考慮下用Hypervisor：淨係快照及備份通常都值回票價。

{{< notice info "題外話：係Linux 整個 Windows 虛擬機打機" >}}
QEMU+KVM任何Linux機都用到。有一個特別玩法係Desktop Linux上面整個Windows虛擬機打機。

我自己部PC就係用[Fedora](https://fedoraproject.org/)做主OS，並係上面整咗個Windows 10虛擬機，詳情可以睇我[呢個Post](../002_win10_to_linux/)。

{{< /notice >}}

## 咩係IPMI？有冇代替品？

IPMI係遠端管理Server既工具。同普通Remote desktop工具唔同既係佢可以係**最底層控制個Server**。

你可以用佢遠端開/關機、改BIOS設定、重裝OS等等。非常適合Server係屋企外或難搬地方既人。

Intel有個類似工具叫**VPro**，好多商用Intel機都有支持，配合[MeshCentral](https://github.com/Ylianst/MeshCentral)可做到中央控制。

另一個相對易入手既代替品係[PiKVM](https://pikvm.org/)，需要你自己買件DIY，或者買作者成套件砌。

想平啲既話可以去淘寶搵翻版（[Blicube](https://www.blicube.com/blikvm-products/)/[Geekworm](https://geekworm.com/collections/pikvm)）。PiKVM甚至可以配合[特定](https://docs.pikvm.org/multiport/#list-of-tested-kvms)[KVM switch](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4/)一下控制多部機。

{{< figure src="./PiKVM.jpg" caption="PiKVM遠端控制Asus家用主機板BIOS" >}}

## CPU冇內顯，買咩卡用黎做轉碼？

Intel Arc系列:thumbsup: 1000蚊樓下買到既平價轉碼神卡，又支持AV1 encoding。

想再平啲既話可考慮二手Nvidia Quadro或Intel DG1。建議睇下呢啲參考資料再買：

[Media Capabilities Supported by Intel Hardware](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/)

[Nvidia Video Encode and Decode GPU Support Matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new)

[Plex Media Server Hardware Transcoding Cheat Sheet](https://www.elpamsoft.com/?p=Plex-Hardware-Transcoding)

[延伸閱讀：Nvidia-patch（移除Nvidia顯示卡既同時間轉碼數上限）](https://github.com/keylase/nvidia-patch)

## 更多討論區/資源

[ServeTheHome（Homelab新聞/硬件評測網頁）](https://www.servethehome.com/)

[Chiphell論壇](https://www.chiphell.com/forum-146-1.html)

[恩山無線論壇（OpenWrt討論）](https://www.right.com.cn/forum/forum-72-1.html)

[Reddit：r/Homelab](https://www.reddit.com/r/homelab/)

[Youtube：司波圖](https://www.youtube.com/@SpotoTsui)

[Youtube：錢韋德](https://www.youtube.com/@qianweide/videos)

[Youtube：TechnoTim](https://www.youtube.com/@TechnoTim)

[Youtube：Lawrence Systems](https://www.youtube.com/@LAWRENCESYSTEMS)

## [返回主目錄](../../categories/連登homelab系列/)
