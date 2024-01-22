+++
title = "連登Homelab系列：自組NAS/Server常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for homelab"
categories = ["連登Homelab系列"]
date = "2024-01-22"
+++

## [按我返回上一章](/posts/004_lihkg_docker/)

## [返回主目錄](/categories/連登homelab系列/)

（本文最後更新時間：2024年1月22日）

## 點解要自組?自組有咩好/壞處?

優點:

- 硬件性價比可以大幅拋離任意大牌子NAS(講緊係同性能下可以平40%或以上)
- 硬件選擇自由 (例如可以用舊機既料砌,或可根據自己需求購買各類零件,M.2 10G網卡聽過未)
- 可以學野 (Sysadmin或Networking功夫,市場對呢D技術有需求)
缺點:
- (通常)體積大, 耗電大
- 要學勁多野(唔係講笑)，Setup麻煩，一定要識英文
- 維護靠自己(不過通常係第一次Set完後就唔洗點理)

## 硬件邊到黎?

舊電腦/Laptop,Raspberry Pi或類似產品,二手市場,淘寶/Amazon等.
部分硬件只可能搵到淘寶/國產貨(或外國只有高價代替品),如各式軟路由工控機/細NAS機箱等.
NAS機箱有外國貨(如Fractal Design既Node系列, Antec P101),不過通常偏大部/貴,想要細部或平D就要淘寶(注意散熱).

## 買Hardware有咩要注意? Intel T字尾CPU係咪慳電D?

- 買CPU之前要預計下個Server既workload. 例如大部分人個server其實85%時間都係idle,
咁樣既話你買CPU唔係睇peak consumption而係idle consumption.
就我所知: 絕大部分monolithic CPU(如Intel及AMD G系列APU)既idle consumption相當低, chiplet CPU(如AMD非G系列)就idle耗電較高.
但如果係常時都high workload既話, chiplet CPU既peak consumption會比monolithic(尤其是Intel)低.

- Intel T字尾CPU係for散熱差既迷你機用,出廠就限左TDP.
但如上所述,絕大部分情況server都係idle,而idle下兩者相差不大.
而且non-T既CPU係BIOS set功耗牆之後理論上可以做到類似T CPU既效果.
(戴定頭盔:我本人冇T字尾CPU,以上都係我網上research出黎既結論)

T vs non-T i5-8500 power draw:
<https://www.reddit.com/r/homelab/comments/189vkss/intel_t_processors_power_consumption_tests/>

- Motherboard有分CPU PCIe lane同Chipset lane.
CPU lane上面既hardware直接同CPU溝通,效能最高.
Chipset lane上面既hardware要同CPU溝通就先要經過一條"橋" (Intel叫佢做DMI).
呢條橋既Bandwidth有限,例如你係chipset上面裝三條NVMe SSD一齊傳輸file,咁就會有bottleneck.
如果你需要超高傳輸速度既話要注意下.

- 如果你想用Hypervisor/行VM的話, 需要注意Motherboard既IOMMU grouping.
因為如果你想將Host既Hardware passthrough入去VM既話, 就要將一個IOMMU group既所有hardware一次過pass曬入去.
例如你PCIe 1槽同SATA controller係同一IOMMU group, 咁你想pass個插左PCIe 1槽既device(e.g. GPU)入VM,就要連SATA controller都送埋入去.
其實有方法呃個Kernel,令佢以為全部hardware都係自己一個IOMMU group (關鍵字: ACS patch). Proxmox係Kernel command line加一行就可以用到呢個patch. 注意用呢個patch有安全性風險.

- Intel CPU既iGPU可以用SR-IOV(12代或以後)或GVT-G(5至10代CPU)方法令Host同VM都用到同一隻iGPU,唔洗額外買隻獨立GPU.
唯獨係11代冇.如果你有Pass iGPU入VM既需求 (e.g. Host靠iGPU著Mon,但VM行Jellyfin要iGPU做Transcode)既話要注意.
12代或更新CPU之SR-IOV方法: <https://github.com/strongtz/i915-sriov-dkms>

4.用咩OS?
VM Hypervisor: Proxmox(推薦), VMWare ESXi, Microsoft Hyper-V, XCP-NG
NAS OS: TrueNAS Core/TrueNAS Scale, Xpenology(黑群輝), Unraid(要比錢), OpenMediaVault
Server OS: Debian, CentOS/RHEL(有No-cost subscription), Home Assistant OS. Windows Server...
Router/Firewall OS: pfSense/OPNSense, OpenWrt/DD-WRT (Consumer Router專用)

## 咩係Hypervisor? 點解要用佢?

Hypervisor即專用黎行VM既OS. 上一點提及既Hypervisor全部都係Type 1, 有接近Bare metal既performance.
用Hypervisor既好處:

- VM Snapshot/Rollback (極有用)
- 成個VM backup/restore
- 容許將來有需要時加VM
- (Proxmox) 有Web UI, 易管理
- 視乎你既硬件, Reboot VM可能比Reboot bare metal host快勁多
咁多好處下,就算你只會用一個VM,都可以考慮下用Hypervisor OS.

小知識: Linux真正既Hypervisor係QEMU/KVM, Proxmox其實只係Debian上面裝左QEMU/KVM加佢自己既config同個web UI.
如果你平時都用Linux既話,可以用QEMU/KVM將GPU passthrough比隻Windows VM,然後係入面打機.Performance同樣接近Bare metal,無明顯Latency. (利申用緊)

## LXC係咩黎?同Docker有咩唔同?

LXC雖然都係"Container",但佢概念上比較接近VM, 係VM既輕量級代替品.
同VM相似,係LXC上面你可以手動裝十幾廿個Service並同時間行. 另外兩者都支持Snapshot/Rollback及Backup/Restore.
LXC同VM唔同既係LXC會同個host共用Kernel (VM有自己Kernel), 所以資源消耗較低, 相對地Security冇VM咁強.
Docker同LXC唔同既係Docker通常一個image淨係會行一隻service, 但LXC你可以係一隻上面裝十幾廿個service同時行.
Docker係app level container:一隻app,一個image. LXC係OS level container: 佢只係一個平台(同VM相似),你要自己係上面裝野行.

## 咩係IPMI?有冇代替品?

IPMI係Remote management solution. 同平時Remote Desktop/VNC唔同既係佢可以係最低層控制個server.
你可以用佢remote開/關機,改BIOS,重裝OS等等. 非常適合Server係Remote或難搬地方既人.
Intel有個類似solution叫VPro,需要CPU同motherboard都支持先用到.
另一個相對易入手既alternative係PiKVM, 需要你自己買件DIY, 或者買作者成set件砌. 想平D既話可以去淘寶搵翻版(北力電子/同伴科技). PiKVM甚至可以配合特定KVM switch一下控制多部機.

## 用咩硬件去加HDD port數?

LSI HBA card, ASM/JMicron HDD controller, 淘寶買

Recommended Controller for Unraid
<https://forums.unraid.net/topic/102010-recommended-controllers-for-unraid/>

TrueNAS reflash LSI card教學
<https://www.truenas.com/community/resources/detailed-newcomers-guide-to-crossflashing-lsi-9211-9300-9305-9311-9400-94xx-hba-and-variants.54/>

9.CPU冇內顯/用AMD,N卡/A卡又貴,買咩卡用黎做Transcode?
Intel Arc系列#wail#pig平價Transcode神卡, 又有AV1 encoding support, 1000蚊樓下買到, 超強
如唔需要AV1,可以考慮二手workstation Nvidia卡,詳情可以睇下面延伸閱讀部分.

### 轉碼知多D

你D片既Format（MP4/MKV/WebM等）其實係Container format黎 ，佢地入面裝住左Video/Audio/Subtitle，三者分別有自己獨特既format。

轉碼其實就係將你條原片既Video/Audio/Subtitle **Decode（解碼）** 去Raw format ，再 **Encode（編碼）** 去你媒體播放器播放到既format，最後再將成品經網絡餵比個媒體播放器。

所以你NAS/轉碼器要有你**原片Audio/Video既Decoder**及**媒體播放器可播放format既Encoder**。

（當然如果Video/Audio/Subtitle某一part唔需要轉碼既話，就唔需要對應既Encoder/Decoder）

[延伸閱讀 (Jellyfin Codec Support)](https://jellyfin.org/docs/general/clients/codec-support/)

延伸閱讀:
Media Capabilities Supported by Intel Hardware:
<https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/>

Nvidia Video Encode and Decode GPU Support Matrix:
<https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new>

Plex Media Server Hardware Transcoding Cheat Sheet
<https://www.elpamsoft.com/?p=Plex-Hardware-Transcoding>

Nvidia-patch (移除Nvidia GPU既同時間Transcode片數上限)
<https://github.com/keylase/nvidia-patch>

## 更多討論區/資源

HKEPC (有NAS同Networking討論區)
<https://www.hkepc.com/forum/>

Reddit
<https://www.reddit.com/r/synology/>
<https://www.reddit.com/r/selfhosted/>
<https://www.reddit.com/r/homelab/>
<https://www.reddit.com/r/DataHoarder/>

司波圖(大陸人，專講NAS/Networking，有教學片)
<https://www.youtube.com/@SpotoTsui>

Nascompares (大牌子NAS及硬碟選擇教學)
<https://nascompares.com/>

ServeTheHome (Homelab新聞/硬件review網頁)
<https://www.servethehome.com/>

TechnoTim/Lawrence Systems (Homelab頻道，涉及範疇較廣)
<https://www.youtube.com/@TechnoTim>
<https://www.youtube.com/@LAWRENCESYSTEMS>

## [返回主目錄](/categories/連登homelab系列/)
