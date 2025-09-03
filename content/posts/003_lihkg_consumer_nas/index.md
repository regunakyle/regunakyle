+++
title = "連登Homelab系列（一）：家用NAS常見問題"
author = "Eric Leung"
description = "買邊隻NAS好、買咩RAM/HDD、點樣安全地放部NAS出街"
categories = ["連登Homelab系列"]
isCJKLanguage = true
date = "2024-01-20"
+++

{{< css "/css/chinese.css" >}}

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2025年6月15日）

{{< figure src="./Cover.jpg" caption="圖片來源：Synology官網" >}}

註：本文其實係連登硬件台Homelab post既內容。（我係樓主）

因為愈寫愈多，我決定抽出黎放係自己個Blog到，順便加啲圖執靚仔啲。~~幫我個Blog加啲流量~~

本指南一共有三章節，每節涵蓋唔同主題。每節開頭及結尾都有通往另一章節（或返回[主目錄](../../categories/連登homelab系列/)）既超連結。

如發現錯處，請於文章下方留言。如果本指南幫助到你，希望你去[Github](https://github.com/regunakyle/regunakyle)右上角比粒星我 :rofl: 謝謝你先 :bowing_man:

**本文（及Homelab系列其他文章）遵循[「署名-相同方式共享 4.0 國際」](https://choosealicense.com/licenses/cc-by-sa-4.0/)協議。轉載請註明出處。**

## NAS買邊隻牌子好？

如果冇特別偏好既話，建議Synology（群輝）:

- 介面人性化，易用，易安裝
- 官方教學文檔內容齊全
- **最多人買，社群大，有問題都易搵答案**

Synology機既缺點係硬件性價比差（2024年了都仲係1Gbps:shit:）。

其他大牌子硬件性能全部跑贏Synology，但Synology軟件做得最好，可以話係買軟件送硬件。

如果識野/想學野既話，可以考慮自組。

（2025年打後既Synology型號只認較貴既Synology硬碟。[下方有討論](#synology-plus系列nas買邊隻model好)）

[Synology NAS選擇器](https://www.synology.com/zh-hk/support/nas_selector)

[QNAP NAS選擇器](https://www.qnap.com/zh-hk/selector/nas-selector)

[ASUSTOR NAS選擇器](https://www.asustor.com/zh-tw/services/nas_selector)

## Synology Plus系列NAS買邊隻Model好？

（此部分最後更新於2025年6月）

先講講最近Synology新機（如DS225+、DS425+、DS725+、DS925+）鎖硬碟一事：而家佢開始逼你用佢自家出既硬碟，唔認第三方硬碟。

不過Synology既軟件始終係領先緊同行，以往佢咁貴都仲跑先既原因係佢軟件做得真係好。

我對新手既建議係照買Synology，但要先**確認自己要咩大小既硬碟**，然後去[Price.com.hk](https://www.price.com.hk/category.php?c=100015&gp=20)睇下呢個大小既唔同牌子硬碟既價錢：如果Synology牌硬碟只係貴少少既話，可以照買新款Synology機；如果貴好多既話，你就買**25年前既舊機種**。當然揀其他牌子或買成品/半成品NAS再刷OS都係可以。

此外，Github上有[方法](https://github.com/007revad/Synology_HDD_db/blob/main/2025_plus_models.md)取消佢既硬碟限制，唔需要先安裝Synology硬碟都用到呢個方法。不過依賴第三方工具始終有風險。

{{< figure src="./SynologySucks.png" caption="圖片來源：NASCompares文章" >}}

然後講講舊機種：[DS224+](https://www.synology.com/zh-tw/products/DS224+)、[DS423+](https://www.synology.com/zh-tw/products/DS423+)、[DS723+](https://www.synology.com/zh-tw/products/DS723+)、[DS923+](https://www.synology.com/zh-tw/products/DS923+)。

DS723+及DS923+冇硬件解碼器/編碼器，但可以加購10G卡，配合NVMe SSD使用可以做到高速大量傳輸。（另外呢兩部Support ECC RAM）

DS224+及DS423+冇得升10G，但有內顯及硬件解碼器/編碼器，比上面兩款更適合做轉碼。

我個人覺得如果你冇10G需求既話，買DS224+或DS423+較好。

## QNAP好似經常出事（如勒索軟件），係咪唔買得？

**唔係。只要唔將部NAS放出街，咩牌子既NAS其實都差唔多咁安全。**

咩牌子NAS都好，想要保障自己既重要數據，就必須**做好備份**。

**備份要有多版本**，例如每個月尾做一次備份，然後保留最多12份（一年），之後先從最舊開始剷。

**做咗備份仲要定時檢查備份完整性**，例如試下還原去其他地方睇下讀唔讀到啲資料。咪去到真係出事然後備份又死埋，個時就只能怪自己。

**3-2-1備份法則**：3份數據、2種儲存媒介、1份存於異地。新手難達成，但可以先從雲端存儲或外置硬碟入手。

**注意RAID並非備份，且不能取代備份。重要數據一定要做好備份。**

[延伸閱讀：Why is RAID not a backup？](https://serverfault.com/questions/2888/why-is-raid-not-a-backup)

{{< notice info "係咪全部數據都一定要做備份？" >}}
備份係風險管理，都要計成本效益。如果你某啲數據唔重要既話，唔備份都可以：但冇備份就要做好因突發事件而冇曬數據既心理準備。

可以想像一下：如果你某啲數據一夜冇曬，你會有咩感覺？如果覺得心痛，咁個啲數據你就要做備份；唔心痛既話，個啲數據既備份優先度就比較低。
{{< /notice >}}

## 點樣存取NAS上既檔案？

用SMB（[Synology教學](https://youtu.be/4d7ib4lEDJ4?si=9m6uCF0Scu3GJaDF)/[QNAP教學](https://youtu.be/SyOzZxRs6qU)）。

手機既話可以用：

- （Synology）DS File（[iOS](https://apps.apple.com/us/app/ds-file/id416751772)/[Android](https://play.google.com/store/apps/details?id=com.synology.DSfile)）或Synology Drive（[iOS](https://play.google.com/store/apps/details?id=com.synology.dsdrive)/[Android](https://apps.apple.com/us/app/synology-drive/id1267275421)）
- （QNAP）QFile Pro（[iOS](https://apps.apple.com/us/app/qfile-pro/id526330408)/[Android](https://play.google.com/store/apps/details?id=com.qnap.qfile)）

## 點確保部NAS冇放出街？

做好以下步驟，通常已足夠保證街外人存取唔到你部NAS。

- 路由器取消任何容許街外存取既設定，包括但不限於：
  - Port forwarding
  - UPnP
  - DMZ
  - Port triggering
- NAS取消Quickconnect/MyQnapCloud或類似服務

同埋平時上網小心啲，某啲電腦病毒可容許黑客透過中咗毒既機存取你屋企網絡上其他電子設備。

如果有需要出街時存取部NAS，**我強烈建議你用VPN**。VPN係安裝相對簡單而又非常安全既街外存取辦法。

[本文下方](#點樣係街外存取屋企部nas)會講幾個街外存取NAS既方法，以及有咩注意事項。

## Synology NAS想加RAM，要買咩型號既RAM？

請睇[第三方RAM選擇教學](https://nascompares.com/guide/synology-unofficial-memory-upgrades-2022-updated/)。

買第三方廠商既RAM未必Work，但仍有唔少人選擇買第三方既RAM，成功例子亦多：例如我自己部DS220+就係用Kingston既16GB RAM。

買之前**最好上網Google下你個NAS型號其他人加咩型號既RAM**，咁起碼成功率大啲。

此外亦可以選擇去淘寶搵下「群輝內存條」，有巴打話係Work（利申我冇買過）。

買Synology既RAM就肯定得，但性價比超級低：同樣價錢夠你買幾條容量大好多既第三方RAM去試。

## 硬碟買邊隻？

名牌廠商（如Seagate、WD/HGST、Toshiba、Synology）既CMR NAS Drive。

**注意唔好買SMR硬碟。** 買硬碟之前要睇下個型號係CMR定SMR（尤其是[WD硬碟](https://www.servethehome.com/wd-red-smr-vs-cmr-tested-avoid-red-smr/)）。

可以買唔同牌子但容量相同既硬碟溝埋用，咁做理論上係安全過全買單一型號。

我揀硬碟既準則係大牌子、CMR，然後就係每TB愈平愈好。

要格價請去[Price.com.hk](https://www.price.com.hk/category.php?c=100015&gp=20)；[Amazon](https://www.amazon.com/b?node=1254762011)等外國網站有時都有特惠。

此外亦可考慮拆碟（Shucking），即是買個3.5吋外置硬碟（例如[WD Elements](https://www.westerndigital.com/zh-tw/products/external-drives/wd-elements-desktop-usb-3-0-hdd)）返黎拆殻拎隻硬碟用。

有時外置硬碟價錢抵玩，唔少鬼佬同連登巴打就選擇買返黎拆。**拆碟有風險**，請做好曬功課再落決定。

緊記：**硬碟遲早會壞，做好備份先係最實際**。

[延伸閱讀：Backblaze企業用硬碟損壞率調查](https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data)

{{< notice note "電腦儲存容量單位：Byte 及Bit" >}}

電腦儲存容量既單位有分兩種：Byte（字節）及Bit（位元）。**注意1 Byte等於8 Bit。**

容量單位前可加Kilo/Mega/Giga/Tera，分別代表1000/1000^2/1000^3/1000^4個對應單位。

網絡速度通常係用Bit做單位，例如你個1000M家居寬頻其實係**每秒1000 Megabit（即1000Mb/s，或125MB/s）**。

Byte既簡寫係大階B（例如KB/MB/GB/TB），Bit既簡寫係細階b（例如Kb/Mb/Gb/Tb），唔好搞錯。

仲有款單位叫Kibibyte/Mebibyte/Gibibyte/Tebibyte（簡寫為KiB/MiB/GiB/TiB），分別代表1024/1024^2/1024^3/1024^4個Byte。

Windows及Linux顯示既MB/GB/TB其實係MiB/GiB/TiB，但硬碟廠標示既就真係1000個隻MB/GB/TB，所以會出現「1TB」硬碟係電腦顯示容量細過1TB既情況。

{{< /notice >}}

## 點樣係街外存取屋企部NAS？

### VPN（推薦）

{{< figure src="./VPN.jpg" >}}

#### Tailscale :thumbsup:

**[Tailscale](https://tailscale.com/)對新手黎講係最好選擇：無需做Port forwarding，安裝超級簡單（[Synology](https://tailscale.com/kb/1131/synology#install-using-synology-package-center)/[QNAP](https://tailscale.com/kb/1273/qnap)教學）。**

**新手唔知揀咩/唔想研究既話，建議直接選用Tailscale。**

**此外，如你需要存取屋企NAS以外既機，可以用Tailscale既[Subnet router](https://tailscale.com/kb/1019/subnets)功能。不過用品牌NAS做Subnet router既話可能有額外步驟，請自行參考官方文檔。**

{{< notice tip "Tailscale直連" >}}
Tailscale有兩種連接方法：直連或用佢地既中繼伺服器（DERP）。Tailscale會做Hole punching並藉此令你部機同屋企部NAS可以直連，失敗既話先會用DERP：直連速度快，DERP就非常慢。

理想情況係乜都唔做就可以直連。要測試既話可以用手機流量係NAS下載大檔案睇速度（我用4G LTE行到35Mb/s），或者SSH入部NAS打`tailscale status`（睇下佢顯示`relay`還是`direct`）。

如果做唔到直連既話，可以嘗試做Port forwarding（路由器`41641/udp`指向NAS既`41641/udp`）。

[延伸閱讀：Tailscale防火牆設定教學](https://tailscale.com/kb/1082/firewall-ports)
{{< /notice >}}

#### Wireguard/OpenVPN

追求性能既話可選擇[Wireguard](https://www.wireguard.com/)。Wireguard比OpenVPN[快勁多](https://www.wireguard.com/performance/)，但要較新既家用路由器先有支持。

再唔係就OpenVPN，好多較舊既家用路由器都有支持。（但其實冇更新既話，安全性同效能都未必係最好）

Wireguard及OpenVPN都要放Port。我建議**只放VPN一個Port出街**，屋企其他Service全部透過VPN使用。

{{< notice warning "注意" >}}
S牌DSM個Linux底太舊，用唔到Wireguard。你可以嘗試自己[裝Wireguard上去用](https://github.com/runfalk/synology-wireguard)（風險自負）；

或者用Wireguard-go版（例如[呢個qBittorrent Docker image](https://hotio.dev/containers/qbittorrent/)有教點設定），但會比普通版慢。

其他可行方案：係NAS裝Linux虛擬機、係家用路由器裝OpenWrt、買部細機仔（如Raspberry Pi或淘寶軟路由機）裝Linux或pfSense/OPNSense等等。裝好後再係上面安裝Wireguard行。
{{< /notice >}}

### Port Forwarding（端口轉發）

要係路由器到做，詳情請參閱你部路由器既說明書。

例如你個Service個IP:Port係`192.168.1.100:5001`，你去路由器到設定Port 1234指向`192.168.1.100`既Port 5001，咁你係街上就可以透過`<屋企Public IP>:1234`存取`192.168.1.100:5001`呢個Service。

{{< notice info "必須有 Public IP" >}}
你要有Public IP先可以係街外掂到屋企部路由器，如果冇既話放Port都冇用。

香港唔少寬頻供應商都會派Public IP，但通常係浮動IP（即自己會轉；通常係重啟光纖盒先會轉）。

先去路由器搵下自己WAN/Public IP係咩，再去[呢到](https://speed.cloudflare.com/)顯示既IP做比較。如果兩者一樣，咁呢個就係你既Public IP；但唔一樣就代表你冇Public IP。有兩個可能性：

1. 你部Modem係Modem+Router一體機，行緊Router mode。解決方法係轉做橋接模式（Bridge mode），可以打電話去寬頻供應商搵師傅搞
2. 你寬頻行緊[CGNAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT)（如果你路由器顯示IP係`100.x.y.z`既話就極有可能係）。CGNAT係國外較常見；就我理解，香港駁網線或光纖既寬頻唔會行CGNAT

如不幸地行緊CGNAT，可以試下聯絡寬頻供應商叫佢派Public IP比你（可能要加錢），或用IPv6（如寬頻供應商有派比你），或直接用其他唔需放Port既方法。

如果唔想記屋企Public IP或避免IP浮動產生問題，可以買個域名及設定DDNS，或者用免費DDNS服務（[DuckDNS](https://www.duckdns.org/)/[Synology DDNS](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_ddns)）。
{{< /notice >}}

### QuickConnect/MyQnapCloud

部分NAS牌子提供免費中繼伺服器，例如Synology既[QuickConnect](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_quickconnect)同QNAP既[MyQnapCloud](https://www.qnap.com/zh-hk/software/myqnapcloud)。

因為我得Synology，呢到只講QuickConnect：

**無需做Port forwarding**，靠Synology伺服器做Hole punching，或（如失敗）用Synology既中繼伺服器做中間人連結部NAS同你部手機/電腦。[（QuickConnect原理）](https://kb.synology.com/zh-tw/WP/Synology_QuickConnect_White_Paper/4)

注意用QuickConnect只能存取到DSM及部分Synology軟件，冇辦法透過佢開NAS上既Plex/Jellyfin等你自己裝既軟件。

### Cloudflare Tunnel

即Cloudflare做中間人幫你放Service出街。**無需做Port forwarding**。

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)本身係免費，但你要有一個[Nameserver係Cloudflare既域名](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)先用到。

用佢既好處係可以獲得Cloudflare既保護（例如防DDOS）；此外亦支持用第三方授權，例如用Google，咁可以指定某啲Gmail帳號持有人先存取到到你啲野。

{{< notice warning "注意" >}}
你要信Cloudflare，呢個[算係Man in the middle](https://www.reddit.com/r/selfhosted/comments/17ogchd/cloudflare_tunnels_privacy/)，佢理論上有方法睇到曬你啲流量既所有內容。

此外，用Cloudflare Tunnel做媒體串流或大檔案傳輸可能違反佢地既服務條款，除非你[將啲檔案放上佢地平台再傳輸](https://blog.cloudflare.com/updated-tos/)。

[延伸閱讀：類似Cloudflare Tunnel方案一覽](https://github.com/anderspitman/awesome-tunneling)
{{< /notice >}}

## 放部NAS出街時，要點保障自己？

**用VPN並確保VPN版本更新**。除非真係要放比街外人用，否則只用VPN。

如果唔用VPN而選擇直接放Port出公海，我有以下建議：

- **重要數據做好備份**，亦要有至少一份**即使被Hack黑客都存取唔到**既備份。
- 開個權限唔多既帳號比自己平時用，非必要唔用管理員帳號
- 路由器或NAS既防火牆封鎖中國及俄羅斯既Inbound IP，或直接封鎖香港以外所有Inbound IP
- Port forwarding唔好用常見既Port（如22、80、443、445），用啲怪數字
- Port forwarding只放反向代理（Reverse proxy），如Nginx或Synology自帶既Reverse Proxy；如選此項，強烈建議你行HTTPS（用自簽或[免費SSL憑證](#點樣獲得免費既ssl憑證)）
- 如有VLAN功能既交換機及勁少少既防火牆（家用路由器裝OpenWrt可以做曬兩樣野）：鎅個VLAN做DMZ，將需要放出街既Service全部放入去，並嚴格限制其對其他VLAN既存取權
- 上網講野小心啲，唔好成為黑客或國家機關既攻擊目標 :shushing_face:

{{< detail "點樣備份先可以「即使被Hack黑客都存取唔到」？" >}}
必須有至少一份**即使被Hack黑客都存取唔到**既備份。例子：

1. 定時將外置硬碟接駁NAS做備份，做好後斷開外置硬碟連接（即離線備份）
2. 由備份伺服器主動從NAS撈數據做備份（而唔係NAS主動倒數據落備份伺服器），且禁止網絡其他機主動存取備份伺服器
3. 單寫多讀（又稱WORM）：即備份伺服器只接受上傳備份，並禁止**所有人**刪除或更改舊既備份。可以睇下[Synology](https://kb.synology.com/en-global/WP/WriteOnce_White_Paper/1)既介紹；此外好多雲端存儲支援類似功能，例如[Backblaze B2](https://www.backblaze.com/docs/cloud-storage-object-lock)

如果黑客攻到入黎，又掂到曬你啲備份，咁佢直接剷曬或加密曬咪得。咁樣你既備份形同虛設。
{{< /detail >}}

只放VPN出街既好處（相比起個個Service都放出街）係你將黑客可以攻擊既地方減至最小（得VPN可以攻擊）。

VPN將安全性放第一，只要設定得當就非常難以攻破，而且有漏洞都好快有修復（所以要保持VPN更新）。

好多Service假設咗你將佢放係可信任既網絡入面，佢地冇咁著重安全性，你放佢出公海就會提高自己被黑客攻破既風險。

{{< notice tip "Port forwarding 小知識" >}}
Port forwarding本身並無任何風險，所有風險都來自你Forward出去既Service本身既安全性強弱。

例如設定得當既VPN/SSH係十分安全；相反放QNAP個網頁介面出去可能好快就出事。

同樣道理，如果你完全信任某個Service既安全性，咁我唔會反對你直接放佢出街。

最緊要係要明白放各種Service出街既風險，同埋要為最壞情況做好準備。
{{< /notice >}}

{{< figure src="./Security.jpg" caption="唔注意安全既後果:laughing:" >}}

## 點樣獲得免費既SSL憑證？

[Let's Encrypt](https://letsencrypt.org/)係一間免費提供SSL憑證既既非牟利機構，好多家用伺服器玩家都用佢地既憑證。

佢地提供[幾種方法](https://letsencrypt.org/docs/challenge-types/)比你證明你擁有個域名。**HTTP-01**方法較簡單，只需起個Web server（如Apache/Nginx），然後放Port即可。我推薦**DNS-01**方法，因為：

1. 唔洗放Port都行到
2. 可以攞Wildcard憑證（例如`*.<子網域名>.duckdns.org`）

不過**DNS-01**要你個[DNS provider支持先用到](https://community.letsencrypt.org/t/dns-providers-who-easily-integrate-with-lets-encrypt-dns-validation/86438)。其中DuckDNS同Cloudflare值得一提，前者係免費，後者有[Cloudflare Tunnel可以玩](#cloudflare-tunnel)。

Synology亦有免費DDNS及自動獲取Let's Encrypt SSL憑證功能（[教學](https://kb.synology.com/zh-tw/DSM/tutorial/How_to_enable_HTTPS_and_create_a_certificate_signing_request_on_your_Synology_NAS)），可配合佢自帶既Reverse proxy使用。其他牌子請自己Google:stuck_out_tongue:

Let's Encrypt既SSL憑證**有效期只有90日**，佢地建議每60日更新一次憑證。

有唔少[工具](https://letsencrypt.org/docs/client-options/)可以幫你管理及更新Let's Encrypt既SSL憑證；[OpenWrt](https://openwrt.org/docs/guide-user/services/tls/acmesh/)/[pfSense](https://docs.netgate.com/pfsense/en/latest/packages/acme/index.html)等OS有插件幫你做；用Docker既玩家可以睇下[Nginx Proxy Manager](https://github.com/NginxProxyManager/nginx-proxy-manager)/[Caddy](https://github.com/caddyserver/caddy/)。

{{< notice warning "必須保護 SSL 憑證密鑰" >}}
SSL憑證有兩個檔案，其中一個係密鑰。你要保護密鑰不被外人得到，唔可以將密鑰分享比陌生人。

[呢到](https://security.stackexchange.com/a/16694)有講SSL憑證密鑰被偷既話有咩可能既後果，以及被偷後要點處理。
{{< /notice >}}

## 咩係轉碼（Transcode）？

一個媒體播放器（如你部電視個瀏覽器或手機App）通常唔係支持曬所有媒體格式（影片格式、音頻格式、字幕格式等）。

如果播放器支持你想播條片既格式，咁部NAS直接經網絡傳輸條片比個播放器就得（即Direct Play）。咁樣部NAS唔洗點做野。

但如果格式不合，有兩個選項：

### NAS轉碼:film_strip:

你部NAS要將條片先轉碼做合適既格式，再傳輸比播放器。咁樣會燒部NAS隻CPU。

如果你隻NAS有硬件解碼器及編碼器既話，部NAS就會將轉碼工作掉比佢地去做。

咁樣NAS隻CPU既負荷（相比起冇硬件解碼器及編碼器既情況）會大大降低，唔會因為播片而卡死部NAS。

通常大牌子NAS既Intel CPU有內顯（有啲型號甚至有獨立顯示卡），內有硬件解碼器及編碼器。

{{< notice tip "轉換影片解析度" >}}
將片轉做唔同解析度（例如4K轉去1080p）都係轉碼既一種，想係街用流量睇屋企4K片既話有用。

另一個做法係下載曬同一個影片既高清版同標清版，出街時直接睇標清版，咁就唔洗轉碼。
{{< /notice >}}

### 換媒體播放器:tv:

例如買隻機頂盒或TV stick插上電視轉輸入源，用佢地做播放器。

機頂盒：[NVIDIA Shield](https://www.nvidia.com/zh-tw/shield/)、[Apple TV](https://www.apple.com/hk/tv-home/)、[Google TV Streamer](https://store.google.com/us/product/google_tv_streamer)、各類Android TV Box等

TV stick：[Google Chromecast](https://store.google.com/tw/product/chromecast_google_tv)等

呢啲產品通常支持更多檔案格式。買邊隻請自己做功課，或去我地Post討論。

另外：如果你用PC/手機/電視瀏覽器睇唔到片既話，可以試下用Plex/Jellyfin既官方程式或[VLC](https://www.videolan.org/)。

[延伸閱讀：Best Kodi Media Player Options 2025](https://forum.kodi.tv/showthread.php?tid=376035)

{{< detail "轉碼知多啲" >}}
你啲片既格式（MP4/MKV/WebM等）其實係Container格式黎，入面裝住咗Video/Audio/Subtitle，三者分別有自己獨特既格式。

轉碼其實就係將你條原片既Video/Audio/Subtitle**解碼（Decode）** 去Raw，再**編碼（Encode）** 去你媒體播放器播放到既格式，最後再將成品經網絡傳輸比個媒體播放器。

所以你隻NAS/影音伺服器要有你**原片格式既解碼器**及**媒體播放器可播放格式（以H.264為主，亦可選H.265或AV1）既編碼器**。

[延伸閱讀：Jellyfin Codec Support及介紹](https://jellyfin.org/docs/general/clients/codec-support/)
{{< /detail >}}

## 有用網站

[HKEPC（有NAS同Networking討論區）](https://www.hkepc.com/forum/)

[Reddit：r/Synology](https://www.reddit.com/r/synology/)

[Reddit：r/Qnap](https://www.reddit.com/r/qnap/)

[Reddit：r/DataHoarder](https://www.reddit.com/r/DataHoarder/)

## [按我進入下一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)
