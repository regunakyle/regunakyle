+++
title = "連登Homelab系列（三）：Homelab常見問題"
author = "Eric Leung"
description = "自組伺服器硬件討論、伺服器OS/Hypervisor介紹"
categories = ["連登Homelab系列"]
date = "2024-01-22"
+++

{{< css "/css/chinese.css" >}}

## [按我返回上一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年8月11日）

{{< figure src="./Cover.jpg" caption="IKEA LackRack - 廉價DIY機櫃" >}}

## 點解要自組？自組有咩好/壞處？

優點：

- :moneybag: 硬件性價比可以大幅拋離任意大牌子機種（講緊係同性能下可以平40%或以上）
- 硬件選擇自由（例如可以用舊機既料砌，或可根據自己需求購買各類零件；[M.2 10G網卡](https://www.innodisk.com/tw/products/embedded-peripheral/communication/egpl-t101)聽過未）
- 可以學野（Sysadmin及Networking功夫，市場對呢啲技術有需求）

缺點：

- 通常體積較大，耗電量較多
- 安裝麻煩，要花時間讀文檔，必須識英文
- 維護靠自己（不過通常係安裝完後就唔洗點理）

## 伺服器硬件邊到黎？

舊電腦/Laptop、各式迷你電腦（如J4125/N100機）、[Raspberry Pi](https://classroomeshop.com/collections/raspberry-pi)或其他單板機（SBC）、各式二手伺服器硬件/洋垃圾等。

部分硬件只可能搵到淘寶或國產貨（或外國只有高價代替品），如各式軟路由工控機及細NAS機箱等。

NAS機箱有外國貨（如Fractal Design既[Node系列](https://www.fractal-design.com/products/cases/node/)），不過通常偏大部/貴，想要細部或平啲就要淘寶。

[延伸閱讀：Small Form Factor PC Master List](https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/)

## 用咩硬件去增加主機板SATA插口數？

請睇以下文章：

[Recommended Controller for Unraid](https://forums.unraid.net/topic/102010-recommended-controllers-for-unraid/)

[Top Picks for TrueNAS and FreeNAS HBAs (Host Bus Adapters)](https://www.servethehome.com/buyers-guides/top-hardware-components-for-truenas-freenas-nas-servers/top-picks-truenas-freenas-hbas/)

用HBA卡既話要自己刷韌體改做IT模式，詳情請自己Google。

## 買硬件有咩要注意？

### 預計伺服器負載買CPU

大部分人既伺服器**絕大部分時間都係待機**，咁樣既話你買CPU唔應該睇滿載耗電量，而要睇**待機耗電量**。

就我所知：Intel及AMD G系列CPU既待機耗電較低，而AMD非G系列就待機耗電較高。

但如果係常時都高負載既話，AMD非G系列CPU通常較同價既Intel CPU有更佳能耗比，值得考慮。

另外：Intel T字尾CPU待機時耗電同普通版差唔多。普通版CPU係BIOS設定功耗牆之後可以做到類似T字尾CPU既效果。

[延伸閱讀：Intel T processors power consumption tests](https://www.reddit.com/r/homelab/comments/189vkss/intel_t_processors_power_consumption_tests/)

[延伸閱讀：Balancing Power Consumption and Cost: The True Price of Efficiency](https://static.xtremeownage.com/blog/2024/balancing-power-consumption-and-cost-the-true-price-of-efficiency)

### ECC RAM

ECC既用途係偵測RAM有否發生Bit flip，如有就嘗試修正。[（運作原理）](https://youtu.be/zzeuOecdgAI)

如果冇ECC，咁你RAM發生Bit flip時可能咩事都冇，可能令伺服器死機，最嚴重既情況係造成偵測唔到既資料損毀。

但Bit flip發生機率極低。除非玩到Data center級數，或者伺服器放係[高輻射地區](https://youtu.be/o3Cx2wmFyQQ)，否則可能廿年都遇唔到一次因Bit flip造成既資料損毀。

雖然ECC RAM本身唔係貴好多，但可以用ECC RAM既主機板/CPU可以貴勁多。尤其是Intel，家用級主機板晶片組（Chipset）全部唔支持ECC，要上到工作站或伺服器級主機板先有，呢啲主機板一手價超級高。

AMD反而係家用級已經有，所以想要ECC可以先睇AMD（例如[5650G](https://www.amd.com/en/products/apu/amd-ryzen-5-pro-5650g)配X570板，低能耗+多核+有內顯+支持ECC+靚IOMMU）。另一個選擇係執二手伺服器硬件/洋垃圾（Xeon/Epyc之類），淘寶一堆平價野。

我既諗法係，你要儲存既數據愈多/愈重要，用既RAM量愈大，就愈值得買ECC件。（當買個心安都好）

[延伸閱讀：Will ZFS and non-ECC RAM kill your data？](https://jrs-s.net/2015/02/03/will-zfs-and-non-ecc-ram-kill-your-data/)

{{< notice info "注意事項" >}}

1. ECC RAM有分RDIMM/LRDIMM/UDIMM，要睇清楚塊板支持邊款先好買。
2. DDR5所謂既內置ECC並非真ECC，且不能取代真ECC。
3. ECC唔係靈丹妙藥，如果條RAM本身係壞既話照樣會狂出Error。
{{< /notice >}}

### 主機板IOMMU組分佈

如果你想行虛擬機的話，有機會要將硬件Passthrough入虛擬機，例如將CPU內顯送入Jellyfin虛擬機或將SATA控制器送入NAS虛擬機。如此送入去既硬件完全由虛擬機控制，可獲得接近無損性能。

要做PCIe passthrough既話，主機板要支持IOMMU，此外亦要注意IOMMU組分佈。

每個硬件都屬於一個IOMMU組，但一個IOMMU組可以有多過一個硬件。**PCIe passthrough係以一個IOMMU組為最小單位**，想送某個硬件就要連同佢IOMMU組既其他硬件一齊送入去。

假設你主機板PCIe 1槽、SATA控制器及網卡係同一IOMMU組，咁你想送個插咗係PCIe 1槽既硬件（如顯示卡）入虛擬機，就要將SATA控制器（連帶硬碟）同網卡都送埋入去。

**宿主機及其他虛擬機不能使用Passthrough咗入一部虛擬機既IOMMU組既全部硬件。**

要自己做功課，搵下咩主機板IOMMU組靚。唔一定要追求最完美（即每一個硬件都獨佔一個IOMMU組），可根據你既需求去查（例如想整NAS虛擬機既話，隻SATA控制器最好獨佔一個IOMMU組）。

值得一提既係，有方法強行令全部硬件都有自己一個獨佔既IOMMU組（關鍵字：ACS override patch）。Proxmox跟呢個[教學](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_isolation)就可以用到呢個Patch。注意用呢個Patch有安全性風險（可以自己Google下）。

[延伸閱讀：檢查主機板IOMMU組方法](../006_simple_guide_for_vfio_1/#主機板iommu)

{{< notice tip "主機板 DMI" >}}
主機板晶片組同CPU之間係用一條PCIe link連接住（Intel稱之為DMI），晶片組上所有硬件會共用DMI既頻寬（Bandwidth）同CPU做資料傳輸。

唔同晶片組既DMI頻寬可能唔同，例如Intel 5xx/6xx系、AMD 6xx系晶片組既頻寬係PCIe 4.0 x8（約16GB/s），AMD 5xx系就只得PCIe 4.0 x4（約8GB/s）。

係晶片組做大量資料傳輸（例如同時存取晶片組上多隻NVMe SSD）既最快速度受DMI頻寬限制。
{{< /notice >}}

### 宿主機及虛擬機共享Intel CPU內顯

Intel CPU既內顯可以用SR-IOV（12代或以後）或GVT-G（5至10代CPU）方法令宿主機同虛擬機都用到佢。

**唯獨係11代咩都冇**。如果你個宿主機同虛擬機都要用內顯（例如個宿主機靠內顯先顯示到野，但虛擬機行Jellyfin要內顯做轉碼）既話要注意。

如果不幸地用緊11代Intel CPU，或唔想搞以上既野，可以轉用LXC或Docker：只要個宿主機用到個內顯，LXC及Docker就肯定有方法用到。

[延伸閱讀：Intel GVT-G setup（Arch Wiki）](https://wiki.archlinux.org/title/Intel_GVT-g)

[延伸閱讀：12代及以後Intel CPU之SR-IOV方法](https://github.com/strongtz/i915-sriov-dkms)

{{< notice tip "Nvidia 顯示卡" >}}
有方法使宿主機同虛擬機共享某啲型號既NVIDIA顯示卡。

[呢到](https://gitlab.com/polloloco/vgpu-proxmox)有適用於Proxmox既安裝教學。注意30系及以上既顯示卡型號用唔到呢個方法。
{{< /notice >}}

## LXC係咩黎？同Docker/虛擬機有咩唔同？

[LXC](https://linuxcontainers.org/)全名係Linux Container。雖然佢同Docker一樣都係"Container"科技，**但佢概念上同使用上都更接近虛擬機，係虛擬機既輕量級代替品。**

同虛擬機相似，係LXC上面你係手動裝軟件行。另外兩者都支持快照（Snapshot）及備份。

LXC（及Docker）同虛擬機唔同既係佢會同個宿主機共用內核（Kernel），所以資源消耗較低。（虛擬機有自己內核）

另一個優勢係，因為LXC（及Docker）只係宿主機上既一個進程（Process），所以可以同個宿主機（及其他Container）共用硬件。虛擬機就只能透過SR-IOV共用硬件，或用Passthrough並失去硬件使用權。

相對地LXC（及Docker）安全性較弱，例如佢地造成Kernel panic時會炸死埋個宿主機及其他虛擬機，虛擬機Kernel panic只會炸死自己。

此外，因為共用內核，宿主機因內核太舊而行唔到既軟件，LXC（及Docker）同樣都行唔到。（例如Wireguard要內核版本5.6或以上）

Docker同LXC唔同既係Docker一個Image淨係會行一隻軟件，但LXC你可以係上面裝十幾廿個軟件同時行。

Docker係軟件級Container：一個Image專行一個軟件 ；LXC係OS級Container：同虛擬機一樣，佢提供咗個OS比你做平台，你係上面玩咩都得。

[延伸閱讀：About Containers and VMs](https://linuxcontainers.org/incus/docs/main/explanation/containers_and_vms/)

## 用咩OS？

{{< underline "Hypervisor OS" >}}

**[Proxmox VE](https://www.proxmox.com/en/proxmox-virtual-environment/overview)** :thumbsup:、[VMWare ESXi（付費）](https://www.vmware.com/hk/products/esxi-and-esx.html)、[Windows Server + Hyper-V（付費）](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server)、[XCP-NG](https://xcp-ng.org/)

[Hyper-V Server 2019（免費）](https://www.microsoft.com/en-us/evalcenter/evaluate-hyper-v-server-2019)

{{< underline "NAS OS" >}}

[TrueNAS](https://www.truenas.com/truenas-community-editions/)[（建議選Scale）](https://www.theregister.com/2024/03/18/truenas_abandons_freebsd/)、[Xpenology（黑群輝）](https://xpenology.com/forum/topic/62221-tutorial-installmigrate-to-dsm-7x-with-tinycore-redpill-tcrp-loader/)、[Unraid（付費）](https://unraid.net/)、[OpenMediaVault](https://www.openmediavault.org/)

{{< notice info "注意事項" >}}

1. TrueNAS (Scale/Core) 會食曬成隻HDD/SSD/USB做Boot disk
2. Unraid要求用USB做Boot disk（而且隻USB要有Unique GUID）
3. Xpenology亦要求用USB做Boot disk

我建議做法係去淘寶搵「USB引導盤」，例如[呢個](https://item.taobao.com/item.htm?id=616480100892)，用佢地安裝方便好多。
{{< /notice >}}

{{< underline "伺服器OS" >}}

**[Debian](https://www.debian.org/)** :thumbsup:、[Ubuntu Server](https://ubuntu.com/server)、[CentOS Stream](https://www.centos.org/centos-stream/)、[RHEL（16個免費）](https://developers.redhat.com/articles/faqs-no-cost-red-hat-enterprise-linux)、[Windows Server（付費）](https://www.microsoft.com/en/windows-server)

{{< underline "路由器/防火牆OS" >}}

[OpenWrt](https://openwrt.org/) :thumbsup:（家用路由器推薦）、[pfSense](https://www.pfsense.org/)/[OPNSense](https://opnsense.org/)

{{< notice info "Openwrt ：小型 Homelab 神器" >}}
一部裝咗OpenWrt既家用路由器可以做曬防火牆、路由器、VLAN交換機同無線存取點既工作。

而且唔洗買好貴既機，例如[GL.iNet MT6000](https://openwrt.org/toh/gl.inet/gl-mt6000)非常適合OpenWrt，現時[淘寶](https://detail.tmall.com/item.htm?id=743831055254)都係700蚊人仔左右。

Linux底既OpenWrt支持好多軟件，例如LXC/Docker、Wireguard、AdGuardHome、NGINX、[SQM](https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm)等等。你甚至可以用幾部OpenWrt機行[802.11s Mesh Networking](https://openwrt.org/docs/guide-user/network/wifi/mesh/80211s)同[802.11k/v/r 快速漫遊](https://vicfree.com/2022/11/openwrt-wpa3-802.11kvr-ap-setup/)。

如果你岩岩開始玩Homelab，可以先從支持OpenWrt既家用路由器入手，有需要時再買獨立Networking硬件。
{{< /notice >}}

{{< figure src="./Proxmox.png" caption="Proxmox VE介面" >}}

## 咩係Hypervisor？點解要用佢？

[Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)即專用黎行虛擬機既軟件。上一項提及既Hypervisor OS用既全部都係用Type 1 hypervisor（例如Proxmox用既係KVM+QEMU），虛擬機可繞過宿主OS直接使用伺服器硬件，藉此獲得接近無損性能。

用Hypervisor既好處：

- 虛擬機快照及備份（非常實用）
- 可以匯入虛擬機，或匯出虛擬機去另一部Hypervisor
- 容許將來擴展規模，例如伺服器硬件升級後可以開多幾隻虛擬機
- 視乎你既硬件，重啟虛擬機可能比重啟實機快勁多

就算你只會用一個虛擬機，都可以考慮下用Hypervisor：淨係快照及備份通常都值回票價。

{{< notice note "題外話：係Linux 整個 Windows 虛擬機打機" >}}
KVM+QEMU任何Linux機都用到。有一個特別玩法係Desktop Linux上面整個Windows虛擬機打機。

我自己部PC就係用[Fedora Linux](https://fedoraproject.org/)做主OS，並用Windows 10虛擬機打機。詳情可以睇我[呢個Post](../002_vfio_primer/)。
{{< /notice >}}

## 咩係IPMI？有冇代替品？

IPMI係遠端管理伺服器既工具。同普通Remote desktop工具唔同既係佢可以係**最底層控制個伺服器**。

不但可以遠端睇到伺服器既螢幕輸出同埋操控佢，仲可以開/關機、改BIOS設定、重裝OS等等。非常適合伺服器放屋企外或難搬地方既人。

Intel有個類似工具叫**VPro**，好多商用Intel機都有支持，配合[MeshCentral](https://github.com/Ylianst/MeshCentral)可做到中央控制。

另一個相對易入手既代替品係[PiKVM](https://pikvm.org/)，需要你自己買件DIY，或者買作者成套件砌。想平啲既話可以去淘寶搵山寨版（[Blicube](https://www.blicube.com/blikvm-products/)/[Geekworm](https://geekworm.com/collections/pikvm)）。

PiKVM甚至可以配合[特定](https://docs.pikvm.org/multiport/#list-of-tested-kvms)[KVM switch](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4/)一下控制多部機。

{{< youtube 232opnNPGNo  >}}

## CPU冇內顯，買咩顯示卡做轉碼？

Intel既獨立顯示卡:thumbsup: 入門級型號（1000蚊樓下買到）就已經有同高階卡一樣既超強轉碼性能。

支持好多媒體格式（包括AV1 encoding），低能耗，有啲型號甚至係半高/單插槽闊，非常適合伺服器用。

此外NVIDIA Quadro系列都唔錯，可以搵下有冇二手貨。

想買轉碼卡既話建議睇下呢啲參考資料再買：

[Media Capabilities Supported by Intel Hardware](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/)

[NVIDIA Video Encode and Decode GPU Support Matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new)

[Plex Media Server Hardware Transcoding Cheat Sheet](https://www.elpamsoft.com/?p=Plex-Hardware-Transcoding)

[延伸閱讀：nvidia-patch（移除NVIDIA顯示卡既同時間轉碼數上限）](https://github.com/keylase/nvidia-patch)

## 更多討論區/資源

[Reddit：r/Homelab](https://www.reddit.com/r/homelab/)

[Chiphell論壇](https://www.chiphell.com/forum-146-1.html)

[ServeTheHome（Homelab新聞/硬件評測網頁）](https://www.servethehome.com/)

[Youtube：司波圖](https://www.youtube.com/@SpotoTsui)

[Youtube：TechnoTim](https://www.youtube.com/@TechnoTim)

[Youtube：Lawrence Systems](https://www.youtube.com/@LAWRENCESYSTEMS)

## 鳴謝

多謝你睇到最後！

特別鳴謝連登Homelab post既一眾巴打，大家既討論令我學到好多野。

如果你冇睇連登Homelab post，歡迎你入黎一齊吹下水，交流下技術 :men_wrestling: 。

## [返回主目錄](../../categories/連登homelab系列/)
