+++
title = "連登Homelab系列（三）：自組NAS/Server常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for homelab"
categories = ["連登Homelab系列"]
date = "2024-01-22"
+++

{{< css "/css/chinese.css" >}}

## [按我返回上一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年2月6日）

{{< figure src="./LackRack.jpg" caption="IKEA LACK土炮Server Rack" >}}

## 點解要自組？自組有咩好/壞處？

優點：

- :moneybag: 硬件性價比可以大幅拋離任意大牌子NAS（講緊係同性能下可以平40%或以上）
- 硬件選擇自由（例如可以用舊機既料砌，或可根據自己需求購買各類零件；M.2 10G網卡聽過未）
- 可以學野（Sysadmin或Networking功夫，市場對呢啲技術有需求）

缺點：

- 通常體積大，耗電大
- 要學勁多野（唔係講笑），Setup麻煩，一定要識英文
- 維護靠自己（不過通常係第一次Set完後就唔洗點理）

## 硬件邊到黎？

舊電腦/Laptop，Raspberry Pi或類似產品，二手市場，淘寶/Amazon等。

部分硬件只可能搵到淘寶/國產貨（或外國只有高價代替品），如各式軟路由工控機/細NAS機箱等。

NAS機箱有外國貨（如Fractal Design既[Node系列](https://www.fractal-design.com/products/cases/node/)），不過通常偏大部/貴，想要細部或平啲就要淘寶。

[Small Form Factor PC Master List](https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/)

## 買硬件有咩要注意？

### 預計Server Workload買CPU

大部分人個Server**其實85%時間都係Idle**，咁樣既話你買CPU唔係睇Peak consumption而係Idle consumption。

就我所知：Intel及AMD G系列CPU既Idle consumption較低，而AMD非G系列就Idle耗電較高。

但如果係常時都高負載既話，AMD非G系列既能耗比就相當高，值得考慮。

另外：Intel T字尾CPU Idle時同普通版差唔多。普通版CPU係BIOS set功耗牆之後理論上可以做到類似T字尾CPU既效果。

[Intel T processors power consumption tests](https://www.reddit.com/r/homelab/comments/189vkss/intel_t_processors_power_consumption_tests/)

### ECC RAM

ECC既用途係偵測RAM入面數據有否出現Bit flip並作出修正[（運作原理）](https://youtu.be/zzeuOecdgAI)。

如果冇ECC，咁你RAM入面數據出現Bit flip時可能咩事都冇，可能令Server死機，最嚴重既情況係造成Data corruption。

但Bit flip發生機率極低。除非玩到去Data Center級數（或者Server係[高輻射地區](https://youtu.be/o3Cx2wmFyQQ)），否則可能十年都遇唔到一次因Bit flip造成既Data corruption。（[測試數據](https://youtu.be/DAXVSNAj6GM)）

問題係雖然ECC RAM本身唔係貴好多，但可以用ECC RAM既主機板/CPU可以貴勁多。尤其是Intel，消費級主機板Chipset全部唔支持ECC，要上到Workstation或Server級Chipset先有。

AMD反而係家用級已經有，所以想要ECC可以先睇AMD（例如[5650G](https://www.amd.com/en/products/apu/amd-ryzen-5-pro-5650g)配X570板，低能耗+多核+ECC+靚IOMMU）。另一個選擇係執二手Server件/洋垃圾（Xeon/Epyc之類），淘寶一堆平價野。

我既諗法係，你要儲存既數據愈多/愈重要，用既RAM量愈大，就愈值得買ECC件。

注意：ECC唔係靈丹妙藥，如果條RAM本身係壞既話照樣會狂出Error。

[延伸閱讀：Will ZFS and non-ECC RAM kill your data？](https://jrs-s.net/2015/02/03/will-zfs-and-non-ecc-ram-kill-your-data/)

{{< notice info "注意事項" >}}

1. ECC RAM有分RDIMM/LRDIMM/UDIMM，要睇清楚塊板支持邊款先至買。
2. DDR5所謂既內置ECC並非真ECC，且不能取代真ECC。
{{< /notice >}}

### 主機板IOMMU grouping

如果你想用Hypervisor/行虛擬機的話，需要注意主機板既IOMMU grouping。

因為如果你想將Host既硬件Passthrough入去虛擬機既話，就要將一個IOMMU group既所有硬件一次過送曬入去。

例如你PCIe 1槽同SATA controller係同一IOMMU group，咁你想送個插咗係PCIe 1槽既硬件(如GPU)入虛擬機，就要連隻SATA controller都送埋入去。

**個Host無法使用任何Passthrough咗入虛擬機既硬件**，可以想像係將個硬件完全地交咗比虛擬機管理。

其實有方法呃個Kernel，令佢以為全部hardware都係自己一個IOMMU group（關鍵字：ACS patch）。

Proxmox係[Kernel command line加一行](https://pve.proxmox.com/wiki/PCI_Passthrough#Verify_IOMMU_isolation)就可以用到呢個Patch。注意用呢個Patch有[安全性風險](https://www.reddit.com/r/VFIO/comments/9jer5r/acs_patch_risk/)。

[Script for checking IOMMU group](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Ensuring_that_the_groups_are_valid)

### Intel CPU虛擬機共享iGPU

Intel CPU既iGPU可以用SR-IOV(12代或以後)或GVT-G(5至10代CPU)方法令Host同虛擬機都用到同一隻iGPU，唔洗額外買隻獨立GPU。

**唯獨係11代咩都冇**。如果你Host同虛擬機都要用iGPU（例如個Host靠iGPU著Mon，但虛擬機行Jellyfin要iGPU做轉碼）既話要注意。

[Arch Wiki：Intel GVT-G](https://wiki.archlinux.org/title/Intel_GVT-g)

[12代或更新CPU之SR-IOV方法](https://github.com/strongtz/i915-sriov-dkms)

{{< notice info "Container幫到你" >}}
如果不幸地用緊11代Intel CPU，或唔想搞以上既野，可以轉用LXC或Docker。

只需將`/dev/dri/<你個Device名>`或成個`/dev/dri`作為Volume mount入去，隻Container就可以用到個iGPU。

注意：個Host要Load定Driver（i915），隻iGPU先會係`/dev/dri`出現。
{{< /notice >}}

## LXC係咩黎？同Docker有咩唔同？

LXC雖然都係"Container"，**但佢概念上更接近虛擬機，係虛擬機既輕量級代替品。**

同虛擬機相似，係LXC上面你可以手動裝十幾廿個Service同時行。另外兩者都支持Snapshot/Rollback及Backup/Restore。

LXC同VM唔同既係LXC會同個Host共用Kernel（VM有自己Kernel），所以資源消耗較低，相對地安全性冇VM咁強。

Docker同LXC唔同既係Docker通常一個Image淨係會行一隻Service，但LXC你可以係一隻上面裝十幾廿個Service同時行。

Docker係Application層級Container：一個Image專行一隻App；LXC係OS層級Container：佢提供咗個OS比你，你要自己係上面裝野行。

## 用咩OS？

{{< figure src="./Proxmox.png" caption="Proxmox VE介面" >}}

### Hypervisor OS

**[Proxmox VE](https://www.proxmox.com/en/proxmox-virtual-environment/overview)** :thumbsup:，[VMWare ESXi](https://www.vmware.com/hk/products/esxi-and-esx.html)，[Windows Server + Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-on-windows-server)，[XCP-NG](https://xcp-ng.org/)

[Hyper-V Server 2019（免費）](https://www.microsoft.com/en-us/evalcenter/evaluate-hyper-v-server-2019)

### NAS OS

[TrueNAS Core/TrueNAS Scale](https://www.truenas.com/truenas-community-editions/)，[Xpenology（黑群輝）](https://xpenology-com.translate.goog/forum/topic/62221-tutorial-installmigrate-to-dsm-7x-with-tinycore-redpill-tcrp-loader/)，[Unraid（付費）](https://unraid.net/)，[OpenMediaVault](https://www.openmediavault.org/)

### Server OS

**[Debian](https://www.debian.org/)** :thumbsup:，[Ubuntu Server](https://ubuntu.com/server)，[CentOS Stream](https://www.centos.org/centos-stream/)，[RHEL（有No-cost subscription）](https://developers.redhat.com/articles/faqs-no-cost-red-hat-enterprise-linux)

### Router/Firewall OS

[pfSense](https://www.pfsense.org/)/[OPNSense](https://opnsense.org/)（x86機推薦），[OpenWrt](https://openwrt.org/)（家用All-in-one router推薦）

## 咩係Hypervisor？點解要用佢？

Hypervisor即專用黎行虛擬機既軟件。上一點提及既Hypervisor全部都係Type 1，有接近原生既Performance。
用Hypervisor既好處：

- 虛擬機Snapshot/Rollback（極有用）
- 成個虛擬機Backup/Restore
- 容許將來有需要時加虛擬機
- （Proxmox）有Web UI，易管理
- 視乎你既硬件，Reboot虛擬機可能比Reboot實機快勁多

咁多好處下，就算你只會用一個虛擬機，都可以考慮下用Hypervisor OS。

## 咩係IPMI？有冇代替品？

IPMI係Remote management solution。同普通Remote desktop唔同既係佢可以係**最底層控制個Server**。

你可以用佢Remote開/關機，改BIOS設定，重裝OS等等。非常適合Server係Remote或難搬地方既人。

Intel有個類似Solution叫**VPro**，好多商用Intel機都有支持，配合[MeshCentral](https://github.com/Ylianst/MeshCentral)可做到中央控制。

另一個相對易入手既代替品係[PiKVM](https://pikvm.org/)，需要你自己買件DIY，或者買作者成Set件砌。

想平啲既話可以去淘寶搵翻版（[Blicube](https://www.blicube.com/blikvm-products/)/[Geekworm](https://geekworm.com/collections/pikvm)）。PiKVM甚至可以配合[特定](https://docs.pikvm.org/multiport/#list-of-tested-kvms)[KVM switch](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4/)一下控制多部機。

{{< figure src="./PiKVM.jpg" caption="PiKVM遠端控制Asus主機板BIOS" >}}

## 用咩硬件去加HDD port數？

請睇以下連結：

[Recommended Controller for Unraid](https://forums.unraid.net/topic/102010-recommended-controllers-for-unraid/)

[TrueNAS reflash LSI card教學](https://www.truenas.com/community/resources/detailed-newcomers-guide-to-crossflashing-lsi-9211-9300-9305-9311-9400-94xx-hba-and-variants.54/)

## CPU冇內顯，買咩卡用黎做轉碼？

Intel Arc系列:thumbsup: 1000蚊樓下買到既平價Transcode神卡，又有AV1 encoding support。

想再平D既話可考慮二手Quadro或Intel DG1。建議睇下呢啲參考資料再買：

[Media Capabilities Supported by Intel Hardware](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/)

[Nvidia Video Encode and Decode GPU Support Matrix](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new)

[Plex Media Server Hardware Transcoding Cheat Sheet](https://www.elpamsoft.com/?p=Plex-Hardware-Transcoding)

[Nvidia-patch（移除Nvidia GPU既同時間轉碼數上限）](https://github.com/keylase/nvidia-patch)

## 更多討論區/資源

[ServeTheHome（Homelab新聞/硬件Review網頁）](https://www.servethehome.com/)

[Chiphell論壇](https://www.chiphell.com/forum-146-1.html)

[恩山無線論壇（OpenWrt討論）](https://www.right.com.cn/forum/forum-72-1.html)

[Reddit：r/Homelab](https://www.reddit.com/r/homelab/)

[Youtube：司波圖](https://www.youtube.com/@SpotoTsui)

[Youtube：錢韋德](https://www.youtube.com/@qianweide/videos)

[Youtube：TechnoTim](https://www.youtube.com/@TechnoTim)

[Youtube：Lawrence Systems](https://www.youtube.com/@LAWRENCESYSTEMS)

## [返回主目錄](../../categories/連登homelab系列/)
