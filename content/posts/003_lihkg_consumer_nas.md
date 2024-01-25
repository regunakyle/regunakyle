+++
title = "連登Homelab系列（一）：普通家用NAS常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for consumer NAS"
categories = ["連登Homelab系列"]
date = "2024-01-20"
+++

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年1月22日）

註：本文其實係[連登硬件台](https://lihkg.com/category/22)Homelab post既內容。（我係樓主:raising_hand:）

因為愈寫愈多，我決定抽出黎放係自己個Blog到，順便加啲圖/Formatting咁。~~幫我個Blog加啲流量~~

## 買邊個牌子好？

如果冇特別偏好既話，建議Synology（群輝），原因如下:

- UI人性化，易用，易Setup
- 官方教學文檔內容齊全
- 最多人買，社群大，有問題都易搵答案
- 相對其他大牌子（如QNAP）冇咁多Security問題

Synology機既缺點係硬件性價比差（2024年了都仲係1Gbps:shit:）。

如果識野/想學野既話，可以考慮自組。[（後方討論）](../005_lihkg_homelab/)

[Synology NAS選擇器](https://www.synology.com/zh-tw/support/nas_selector)

## QNAP好似經常出事（如勒索軟件），係咪唔買得？

**唔係**。 如果你部機唔放出街既話，其實部部機都差唔多咁安全。

咩牌子NAS都好，想要保障自己數據既話，做好以下既野：

- **重要數據做好備份**（3-2-1備份：3份數據，2種儲存媒介，1份存於異地）。可以先從雲端存儲或外置HDD入手
- Router取消UPnP
- Router取消任何Port Forwarding（通訊埠轉發/「放Port」）
- NAS取消Quickconnect/MyQnapCloud
- 如NAS支持，定期為數據做唯讀既快照（Snapshot）

**做左備份仲要定時檢查備份Work唔Work**，例如試下Restore去其他地方睇下讀唔讀到啲資料。咪去到真係出事然後備份又死埋，個時就只能怪自己。:sob:

**注意RAID並非備份，且不能取代備份。重要數據一定要做好備份。**

[延伸閱讀：Why is RAID not a backup？](https://serverfault.com/questions/2888/why-is-raid-not-a-backup)

## 點樣係街外存取屋企部NAS？

最常見方法有以下：

### VPN（推薦）:thumbsup:

[Tailscale](Tailscale)最簡單，無需做Port Forwarding，亦唔需要Public IP，亦有大牌子NAS setup教學（[Synology](https://tailscale.com/kb/1131/synology)/[QNAP](https://tailscale.com/kb/1273/qnap)），對新手黎講係最好選擇。

識玩既可以自己Setup [Wireguard](https://www.wireguard.com/)（易Setup+極低overhead）。

再唔係就OpenVPN，好多家用Router都有支持。

注意： S牌DSM個Linux底太舊 ，Kernel冇Wireguard。[你可以嘗試自己裝Wireguard上去用](https://github.com/runfalk/synology-wireguard)。（風險自負）

### Port Forwarding

要係Router到做，詳情請參閱你部Router既說明書。

### [QuickConnect](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_quickconnect)/[MyQnapCloud](https://www.qnap.com/zh-hk/software/myqnapcloud)

（呢到只講QuickConnect，因為我冇QNAP）

無需做Port forwarding，靠Synology Server做Hole punching，或（如失敗）用Synology Relay Server做中間人連結部NAS同你部手機/電腦。[（QuickConnect白皮書）](https://kb.synology.com/zh-tw/WP/Synology_QuickConnect_White_Paper/4)

注意用QuickConnect只能掂到DSM及部分Synology App，冇辦法透過佢開NAS上既Plex/Jellyfin等等你自己裝既App。

### [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) （進階）

經Cloudflare放Service出街，無需做Port forwarding。

唔洗比錢都用到，但你要有一個Nameserver係Cloudflare既域名先得。

支持用第三方授權：例如用Google，咁可以指定某啲特定Gmail既持有人先存取到到你啲野。

注意：你要信Cloudflare，呢個算係[Man-in-the-middle](https://www.reddit.com/r/selfhosted/comments/17ogchd/cloudflare_tunnels_privacy/)，佢有方法睇到曬你啲流量既所有內容。

## 放部NAS出街時，要點保障自己？

- **用VPN並確保VPN版本更新**。除非真係要放比街外人用，否則盡可能VPN
- 開個權限唔多既User account比自己平時用，非必要唔用Admin/Root account
- **重要數據做好備份**
- Firewall/NAS封鎖Inbound中國及俄羅斯IP，或直接Block香港以外所有IP
- 唔好用常見既Port（如22/80/443/445/3389），用啲怪數字
- 如有VLAN-aware既Switch及勁少少既Firewall（如pfSense）： 鎅個VLAN做DMZ，將需要放出街既Service全部放入去， 並嚴格限制其對其他VLAN既存取權

注意：正常咩都唔做既話外人係冇辦法主動去掂你屋企網絡中既機器（除非你屋企有部機中左毒）

:man_student:小知識：Port Forwarding本身並無任何風險，所有風險都係來至你Forward出去既Service本身既安全性強弱

{{< figure src="/images/blog/003/security.png" caption="唔注意安全既後果:laughing:" >}}

## （2024年1月）Synology Plus系列買咩Model好？

現時最新出左[DS224+](https://www.synology.com/zh-tw/products/DS224+)，[DS423+](https://www.synology.com/zh-tw/products/DS423+)，[DS723+](https://www.synology.com/zh-tw/products/DS723+)，[DS923+](https://www.synology.com/zh-tw/products/DS923+)。

DS723+及DS923+冇Hardware encode/decoder，但可以加購10G卡，配合NVMe SSD使用可以做到高速大量傳輸。（另外呢兩部Support ECC RAM）

DS224+及DS423+冇得升10G，但用Intel CPU，有Hardware encode/decoder，比上面兩款更適合做轉碼。

我個人覺得如果你冇10G需求既話，買DS224+或DS423+較好。

## 有冇得加RAM？要買邊條？

睇返你想買個隻Model個Spec，正常有寫有冇得加。

Spec上面會寫最多加幾多，但通常可加更多。（我部DS220+加左16GB）

至於RAM選擇係玄學，可以有兩個人用同一部NAS同一型號RAM，但一個加完Boot唔到，另一個Boot到咁既情況。

買之前最好上網Google下其他人買左咩型號咩Size既RAM，起碼成功率大啲。

如果肯定要佢Work，咁要買返Synology既RAM，但性價比超級低:money_with_wings:。

[RAM選擇教學](https://nascompares.com/guide/synology-unofficial-memory-upgrades-2022-updated/)

## HDD買邊隻？

名牌廠商既CMR NAS Drive，如Seagate，WD/HGST，Toshiba等廠。

**注意唔好買SMR HDD。**

可以買唔同牌子既HDD溝埋用，理論上咁做係安全過全買單一型號。

我揀HDD既準則係大牌子，CMR，然後就係每TB愈平愈好。

要格價請去[Price.com.hk](https://www.price.com.hk/category.php?c=100015&gp=20)；[Amazon](https://www.amazon.com/b?node=1254762011)等外國網站有時都有特惠。

**HDD遲早會壞，做好備份先係最實際。**

[BackBlaze HDD stat](https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data)

## 咩係轉碼（Transcoding）？

一個媒體播放器（如你部電視個瀏覽器）通常唔係支持所有媒體格式（影片格式、音頻格式、字幕格式等）。

如果播放器支持你想播條片既格式，咁部NAS直接經網絡餵條片比個播放器就得 （即Direct Play） ，咁樣部NAS唔洗點做野。

但如果格式不合，有兩個選項：

### NAS轉碼:film_strip:

你部NAS要將條片先轉碼做合適既格式，再餵比播放器。咁樣會燒部NAS隻CPU。

如果你隻NAS有Hardware encoder+decoder既話，部NAS就會將轉碼工作掉比佢地去做。

通常大牌子NAS既Intel CPU都有內顯，或者獨立顯示卡，佢地都有Hardware encoder+decoder。

咁樣NAS既CPU既負荷（相比冇encoder+decoder既情況）會大大降低，唔會因為播片而卡死部NAS。（而且通常可以同時間轉碼多過一條片）

:man_student:小知識：將片轉做唔同畫質（例如4K轉去1080p）都係轉碼既一種，如果想係街到用流量睇屋企4K片既話有用

### 換媒體播放器:tv:

例如買隻機頂盒插上電視轉輸入源，等隻機頂盒做播放器。機頂盒通常支持更多檔案格式。

機頂盒有Apple TV/Chromecast/Roku/Firestick/Nvidia Shield等，買邊隻請自行做Research或呢到討論。

另外：如果你用緊PC/手機瀏覽器睇片唔work既話，可以試下用[VLC](https://www.videolan.org/)或Plex/Jellyfin既App。

## 有用網站

[HKEPC（有NAS同Networking討論區）](https://www.hkepc.com/forum/)

[Reddit：r/synology](https://www.reddit.com/r/synology/)

[Reddit：r/qnap](https://www.reddit.com/r/qnap/)

## [按我進入下一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)
