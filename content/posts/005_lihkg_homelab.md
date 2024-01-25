+++
title = "連登Homelab系列（三）：自組NAS/Server常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for homelab"
categories = ["連登Homelab系列"]
date = "2024-01-22"
+++

## [按我返回上一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年1月22日）

{{< figure src="/images/blog/005/LackRack.jpg" caption="土炮IKEA枱做Server Rack" >}}

## 點解要自組？自組有咩好/壞處？

優點：

- :moneybag: 硬件性價比可以大幅拋離任意大牌子NAS（講緊係同性能下可以平40%或以上）
- 硬件選擇自由（例如可以用舊機既料砌，或可根據自己需求購買各類零件；M.2 10G網卡聽過未）
- 可以學野（Sysadmin或Networking功夫，市場對呢啲技術有需求）

缺點：

- （通常）體積大，耗電大
- 要學勁多野（唔係講笑），Setup麻煩，一定要識英文
- 維護靠自己（不過通常係第一次Set完後就唔洗點理）

## 硬件邊到黎？

舊電腦/Laptop，Raspberry Pi或類似產品，二手市場，淘寶/Amazon等。

部分硬件只可能搵到淘寶/國產貨（或外國只有高價代替品），如各式軟路由工控機/細NAS機箱等。

NAS機箱有外國貨（如Fractal Design既[Node系列](https://www.fractal-design.com/products/cases/node/)，[Antec P101](https://www.antec.com/product/case/p101-silent)），不過通常偏大部/貴，想要細部或平啲就要淘寶。

[SFF PC Master List](https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/)

## 買硬件有咩要注意？

### 預計Server Workload買CPU

大部分人個Server**其實85%時間都係Idle**，咁樣既話你買CPU唔係睇Peak consumption而係Idle consumption。

就我所知：Intel及AMD G系列CPU既Idle consumption相當低，而AMD非G系列就Idle耗電較高。

但如果係常時都高負載既話，AMD非G系列既能耗比就相當高，值得考慮。

另外：Intel T字尾CPU Idle時同普通版差唔多。普通版CPU係BIOS set功耗牆之後理論上可以做到類似T字尾CPU既效果。

[T vs non-T i5-8500 power draw](https://www.reddit.com/r/homelab/comments/189vkss/intel_t_processors_power_consumption_tests/)

### 主機板IOMMU grouping

如果你想用Hypervisor/行虛擬機的話，需要注意主機板既IOMMU grouping。

因為如果你想將Host既硬件Passthrough入去虛擬機既話，就要將一個IOMMU group既所有硬件一次過送曬入去。

例如你PCIe 1槽同SATA controller係同一IOMMU group，咁你想送個插左係PCIe 1槽既硬件(如GPU)入虛擬機，就要連隻SATA controller都送埋入去。

其實有方法呃個Kernel，令佢以為全部hardware都係自己一個IOMMU group（關鍵字：ACS patch）。

Proxmox係[Kernel command line加一行](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_isolation)就可以用到呢個patch。注意用呢個Patch有[安全性風險](https://www.reddit.com/r/VFIO/comments/9jer5r/acs_patch_risk/)。

[Script for checking IOMMU group](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Ensuring_that_the_groups_are_valid)

### Intel CPU虛擬機共享iGPU

Intel CPU既iGPU可以用SR-IOV(12代或以後)或GVT-G(5至10代CPU)方法令Host同虛擬機都用到同一隻iGPU，唔洗額外買隻獨立GPU。

**唯獨係11代咩都冇**。如果你有送iGPU入虛擬機既需求（例如個Host靠iGPU著Mon，但虛擬機行Jellyfin要iGPU做轉碼）既話要注意。

[Arch Wiki：Intel GVT-G](https://wiki.archlinux.org/title/Intel_GVT-g)

[12代或更新CPU之SR-IOV方法](https://github.com/strongtz/i915-sriov-dkms)

## 用咩OS？

### VM Hypervisor

**[Proxmox VE](https://www.proxmox.com/en/proxmox-virtual-environment/overview)** :thumbsup:，[VMWare ESXi](https://www.vmware.com/hk/products/esxi-and-esx.html)，[Windows Server + Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server)，[XCP-NG](https://xcp-ng.org/)

### NAS OS

[TrueNAS Core/TrueNAS Scale](https://www.truenas.com/truenas-community-editions/)，[Xpenology（黑群輝）](https://xpenology-com.translate.goog/forum/topic/62221-tutorial-installmigrate-to-dsm-7x-with-tinycore-redpill-tcrp-loader/)，[Unraid（付費）](https://unraid.net/)，[OpenMediaVault](https://www.openmediavault.org/)

### Server OS

**[Debian](https://www.debian.org/)** :thumbsup:，[Ubuntu Server](https://ubuntu.com/server)，[CentOS Stream](https://www.centos.org/centos-stream/)，[RHEL（有No-cost subscription）](https://developers.redhat.com/articles/faqs-no-cost-red-hat-enterprise-linux)

### Router/Firewall OS

[pfSense](https://www.pfsense.org/)/[OPNSense](https://opnsense.org/)，[OpenWrt](https://openwrt.org/) :thumbsup:（家用All-in-one router專用）

## 咩係VM Hypervisor？點解要用佢？

Hypervisor即專用黎行虛擬機既OS。上一點提及既Hypervisor全部都係Type 1，有接近原生既Performance。
用Hypervisor既好處：

- 虛擬機Snapshot/Rollback（極有用）
- 成個虛擬機Backup/Restore
- 容許將來有需要時加虛擬機
- （Proxmox）有Web UI，易管理
- 視乎你既硬件，Reboot虛擬機可能比Reboot實機快勁多

咁多好處下，就算你只會用一個虛擬機，都可以考慮下用Hypervisor OS。

## LXC係咩黎？同Docker有咩唔同？

LXC雖然都係"Container"，**但佢概念上比較接近虛擬機，使用上同虛擬機冇大分別。係虛擬機既輕量級代替品。**

同虛擬機相似，係LXC上面你可以手動裝十幾廿個Service同時行。另外兩者都支持Snapshot/Rollback及Backup/Restore。

LXC同VM唔同既係LXC會同個Host共用Kernel（VM有自己Kernel），所以資源消耗較低，相對地安全性冇VM咁強。

Docker同LXC唔同既係Docker通常一個Image淨係會行一隻Service，但LXC你可以係一隻上面裝十幾廿個Service同時行。

Docker係Application level container：一隻App，一個Image。LXC係OS level container：佢提供左個OS，你要自己係上面裝野行。

## 咩係IPMI？有冇代替品？

IPMI係Remote management solution。同普通Remote desktop唔同既係佢可以係**最低層控制個Server**。

你可以用佢Remote開/關機，改BIOS，重裝OS等等。非常適合Server係Remote或難搬地方既人。

Intel有個類似solution叫**VPro**，好多商用Intel機都有支持，配合[MeshCentral](https://github.com/Ylianst/MeshCentral)可做到中央控制。

另一個相對易入手既Alternative係[PiKVM](https://pikvm.org/)，需要你自己買件DIY，或者買作者成Set件砌。

想平啲既話可以去淘寶搵翻版（[Blicube](https://www.blicube.com/blikvm-products/)/[Geekworm](https://geekworm.com/collections/pikvm)）。PiKVM甚至可以配合[特定](https://docs.pikvm.org/multiport/#list-of-tested-kvms)[KVM switch](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4/)一下控制多部機。

## 用咩硬件去加HDD port數？

[Recommended Controller for Unraid](https://forums.unraid.net/topic/102010-recommended-controllers-for-unraid/)

[TrueNAS reflash LSI card教學](https://www.truenas.com/community/resources/detailed-newcomers-guide-to-crossflashing-lsi-9211-9300-9305-9311-9400-94xx-hba-and-variants.54/)

## CPU冇內顯，買咩卡用黎做轉碼？

Intel Arc系列:thumbsup: 1000蚊樓下買到既平價Transcode神卡，又有AV1 encoding support。

如果想買GPU做轉碼，可以睇下呢啲參考資料：

[Media Capabilities Supported by Intel Hardware](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/)

[Nvidia Video Encode and Decode GPU Support Matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new)

[Plex Media Server Hardware Transcoding Cheat Sheet](https://www.elpamsoft.com/?p=Plex-Hardware-Transcoding)

[Nvidia-patch（移除Nvidia GPU既同時間轉碼數上限）](https://github.com/keylase/nvidia-patch)

### 轉碼知多啲

你啲片既格式（MP4/MKV/WebM等）其實係Container格式黎 ，佢地入面裝住左Video/Audio/Subtitle，三者分別有自己獨特既格式。

轉碼其實就係將你條原片既Video/Audio/Subtitle**Decode（解碼）**去Raw，再**Encode（編碼）**去你媒體播放器播放到既format，最後再將成品經網絡餵比個媒體播放器。

所以你NAS/轉碼器要有你**原片Audio/Video格式既Decoder**及**媒體播放器可播放格式既Encoder**。

（當然如果Video/Audio/Subtitle某一Part唔需要轉碼既話，就唔需要對應既Encoder/Decoder）

[Jellyfin Codec Support](https://jellyfin.org/docs/general/clients/codec-support/)

## 更多討論區/資源

[ServeTheHome（Homelab新聞/硬件review網頁）](https://www.servethehome.com/)

[Chiphell論壇](https://www.chiphell.com/forum-146-1.html)

[Reddit：r/homelab](https://www.reddit.com/r/homelab/)

[Reddit：r/HomeNetworking](https://www.reddit.com/r/HomeNetworking/)

[Reddit：r/DataHoarder](https://www.reddit.com/r/DataHoarder/)

[Youtube：司波圖](https://www.youtube.com/@SpotoTsui)

[Youtube：錢韋德](https://www.youtube.com/@qianweide/videos)

[Youtube：TechnoTim](https://www.youtube.com/@TechnoTim)

[Youtube：Lawrence Systems](https://www.youtube.com/@LAWRENCESYSTEMS)

## [返回主目錄](../../categories/連登homelab系列/)
