+++
title = "連登Homelab系列（一）：普通家用NAS常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for consumer NAS"
categories = ["連登Homelab系列"]
date = "2024-01-20"
+++

{{< css "/css/chinese.css" >}}

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年4月18日）

{{< figure src="./Cover.jpg" caption="圖片來源：Synology官網" >}}

註：本文其實係連登硬件台Homelab post既內容。（我係樓主）

因為愈寫愈多，我決定抽出黎放係自己個Blog到，順便加啲圖執靚仔啲。~~幫我個Blog加啲流量~~

本指南一共有三章節，每節涵蓋唔同主題。每節開頭及結尾都有通往另一章節（或返回[主目錄](../../categories/連登homelab系列/)）既超連結。

如發現錯處，煩請[提交Issue](https://github.com/regunakyle/regunakyle/issues/new)。如果本指南幫助到你，希望你去[Github](https://github.com/regunakyle/regunakyle)右上角比粒星我 :rofl: 謝謝你先 :bowing_man:

**本文（及Homelab系列其他文章）遵循[「署名-相同方式共享 4.0 國際」](https://choosealicense.com/licenses/cc-by-sa-4.0/)協議。轉載請註明出處。**

## NAS買邊隻牌子好？

如果冇特別偏好既話，建議Synology（群輝）:

- 介面人性化，易用，易安裝
- 官方教學文檔內容齊全
- **最多人買，社群大，有問題都易搵答案**

Synology機既缺點係硬件性價比差（2024年了都仲係1Gbps:shit:）。

其他大牌子硬件性能全部跑贏Synology，但Synology軟件做得最好，可以話係買軟件送硬件。

如果識野/想學野既話，可以考慮自組。

[延伸閱讀：Synology NAS選擇器](https://www.synology.com/zh-tw/support/nas_selector)

## QNAP好似經常出事（如勒索軟件），係咪唔買得？

**唔係**。只要唔將部NAS放出街，咩牌子既NAS其實都差唔多咁安全。

咩牌子NAS都好，想要保障自己既重要數據，就必須**做好備份**。

**備份要有多版本**，例如每個月尾做一次備份，然後保留最多12份（一年），之後先從最舊開始剷。

優質備份軟件係保留多版本既同時亦會將重複資料刪除（即Deduplication）以節省空間，例如[Synology Hyper Backup](https://www.synology.com/zh-hk/dsm/feature/hyper_backup)、[BorgBackup](https://github.com/borgbackup/borg)、[Restic](https://github.com/restic/restic)等等都做到。

**做咗備份仲要定時檢查備份Work唔Work**，例如試下還原去其他地方睇下讀唔讀到啲資料。咪去到真係出事然後備份又死埋，個時就只能怪自己。

**3-2-1備份法則**：3份數據、2種儲存媒介、1份存於異地。可以先從雲端存儲或外置硬碟入手。

**注意RAID並非備份，且不能取代備份。重要數據一定要做好備份。**

[延伸閱讀：Why is RAID not a backup？](https://serverfault.com/questions/2888/why-is-raid-not-a-backup)

{{< notice info "係咪全部數據都一定要做備份？" >}}
**唔係**。備份係風險管理，都要計成本效益。如果你某啲數據唔重要既話，唔備份都可以：但冇備份就要做好因突發事件而冇曬數據既心理準備。

可以想像一下：如果你某啲數據一夜冇曬，你會有咩感覺？如果覺得心痛，咁個啲數據你就要做備份；唔心痛既話，個啲數據既備份優先度就比較低。
{{< /notice >}}

## 點確保部NAS冇放出街？

做好以下步驟，通常已足夠保證街外人存取唔到你部NAS。

- 路由器取消任何容許街外存取既設定，包括但不限於：
  - UPnP
  - Port forwarding
  - Port triggering
  - DMZ
- NAS取消Quickconnect/MyQnapCloud或類似服務

同埋平時上網小心啲，某啲電腦病毒可容許黑客透過中咗毒既機存取你屋企網絡上其他電子設備。

如果有需要出街時存取部NAS，**我強烈建議你用VPN**。VPN係安裝相對簡單而又非常安全既街外存取辦法。

[本文下方](#點樣係街外存取屋企部nas)會講幾個放NAS出街既方法，以及有咩注意事項。

## Synology Plus系列NAS買邊隻Model好？

（此部分最後更新於2024年1月）

現時最新出咗[DS224+](https://www.synology.com/zh-tw/products/DS224+)、[DS423+](https://www.synology.com/zh-tw/products/DS423+)、[DS723+](https://www.synology.com/zh-tw/products/DS723+)、[DS923+](https://www.synology.com/zh-tw/products/DS923+)。

DS723+及DS923+冇Hardware encode/decoder，但可以加購10G卡，配合NVMe SSD使用可以做到高速大量傳輸。（另外呢兩部Support ECC RAM）

DS224+及DS423+冇得升10G，但有內顯及Hardware encoder/decoder，比上面兩款更適合做轉碼。

我個人覺得如果你冇10G需求既話，買DS224+或DS423+較好。

## Synology NAS想加RAM，要買咩型號既RAM？

請睇[第三方RAM選擇教學](https://nascompares.com/guide/synology-unofficial-memory-upgrades-2022-updated/)。

買第三方廠商整既RAM有風險：可以有兩個人用同型號NAS，買同型號既第三方RAM，但一個加完開唔到機，另一個開到機咁既情況。

雖然咁講，但都有唔少人選擇買第三方既RAM，成功例子亦多：例如我自己部DS220+就係用Kingston既16GB RAM。

買之前**最好上網Google下你個NAS型號其他人加咩型號既RAM**，咁起碼成功率大啲。

買Synology既RAM就肯定Work，但性價比超級低：同樣價錢夠你買幾條容量更大既第三方RAM去試。

## 硬碟買邊隻？

名牌廠商（如Seagate、WD/HGST、Toshiba）既CMR NAS Drive。

**注意唔好買SMR硬碟。** 買硬碟之前要睇下個型號係CMR定SMR（尤其是[WD硬碟](https://www.hkepc.com/20555/RED_%E7%A1%AC%E7%A2%9F%E5%81%B7%E6%8F%9B_SMR_%E4%BA%8B%E4%BB%B6%E9%99%B7%E9%9B%86%E9%AB%94%E8%A8%B4%E8%A8%9F_WD_%E5%92%8C%E8%A7%A3%E8%B3%A0_270_%E8%90%AC%E7%BE%8E%E5%85%83%E7%94%A8%E5%AE%B6%E5%8F%AF%E7%B6%B2%E4%B8%8A%E7%94%B3%E8%AB%8B)）。

可以買唔同牌子但容量相同既硬碟溝埋用，咁做理論上係安全過全買單一型號。

我揀硬碟既準則係大牌子、CMR，然後就係每TB愈平愈好。

要格價請去[Price.com.hk](https://www.price.com.hk/category.php?c=100015&gp=20)；[Amazon](https://www.amazon.com/b?node=1254762011)等外國網站有時都有特惠。

此外亦可考慮拆碟（Shucking），即是買個3.5吋外置硬碟（例如[WD Elements](https://www.westerndigital.com/zh-tw/products/external-drives/wd-elements-desktop-usb-3-0-hdd)）返黎拆殻拎隻硬碟用。

有時外置硬碟價錢抵玩，唔少鬼佬同連登巴打就選擇買返黎拆。**拆碟有風險**，請做好曬功課再落決定。

緊記：**硬碟遲早會壞，做好備份先係最實際**。

[延伸閱讀：BackBlaze企業用硬碟損壞率調查](https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data)

## 點樣係街外存取屋企部NAS？

### VPN（推薦）:thumbsup:

{{< figure src="./VPN.jpg" >}}

[Tailscale](https://tailscale.com/)對新手黎講係最好選擇：**無需做Port forwarding**，安裝極簡單（[Synology](https://tailscale.com/kb/1131/synology)/[QNAP](https://tailscale.com/kb/1273/qnap)教學），裝完就用得。新手唔知揀咩/唔想研究既話可以先試Tailscale。

追求性能既話可選擇[Wireguard](https://www.wireguard.com/)。Wireguard比OpenVPN[快勁多](https://www.wireguard.com/performance/)，但要較新既家用路由器先有支持。

再唔係就OpenVPN，好多較舊既家用路由器都有支持。

如果選擇用Wireguard/OpenVPN（要做Port forwarding），我建議你**只放VPN一個Port出街**，屋企其他Service全部透過VPN使用。

{{< notice tip "Tailscale直連" >}}
Tailscale有兩種連接方法：直連或用佢地既中繼Server（DERP）。Tailscale會做Hole punching並藉此令你部機同屋企部NAS可以直連，失敗既話先會用DERP：直連速度快，DERP就非常慢。

理想情況係唔洗做野就可以直連。要測試既話可以用手機流量係NAS下載大檔案睇速度（我用4G LTE行到35Mbps），或者SSH入部NAS打`tailscale status`（睇下佢顯示`relay`還是`direct`）。

如果做唔到直連既話，可以嘗試做Port forwarding（路由器`41641/udp`放NAS既`41641/udp`）。

[延伸閱讀：Tailscale防火牆設定教學](https://tailscale.com/kb/1082/firewall-ports)
{{< /notice >}}

{{< notice warning "注意" >}}
S牌DSM個Linux底太舊，用唔到Wireguard。你可以嘗試自己[裝Wireguard上去用](https://github.com/runfalk/synology-wireguard)（風險自負）；

或者用Wireguard-go版（例如[呢個qBittorrent Docker image](https://hotio.dev/containers/qbittorrent/)有教點設定），但會比普通版慢。

其他可行方案：係NAS裝Linux虛擬機、係家用路由器裝OpenWrt、買部細機仔（如Raspberry Pi或淘寶軟路由機）裝Linux或pfSense/OPNSense等等。裝好後再係上面安裝Wireguard行。
{{< /notice >}}

### Port Forwarding（通訊埠轉發/「放Port」）

要係路由器到做，詳情請參閱你部路由器既說明書。

例如你個Service個IP:Port係`192.168.1.100:5001`，你去路由器到設定Port 1234 -> `192.168.1.100`（Port 5001），

咁你係街上就可以用`<屋企Public IP>:1234`掂到`192.168.1.100:5001`呢個Service。

{{< notice info "必須有 Public IP" >}}
你要有Public IP先可以係街外掂到屋企部路由器，如果冇既話放Port都冇用。

香港唔少寬頻供應商都會派Public IP，但通常係浮動IP（即自己會轉；通常係重啟光纖盒先會轉）。

先去路由器搵下自己WAN/Public IP係咩，再去[呢到](https://www.whatismyip.com/)顯示既IP做比較。如果兩者一樣，咁呢個就係你既Public IP；但唔一樣就代表你冇Public IP。有兩個可能性：

1. 你部Modem係Modem+Router一體機，行緊Router mode。解決方法係轉做橋接模式（Bridge mode），可以打電話去寬頻供應商搵師傅搞
2. 你寬頻行緊[CGNAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT)（如果你路由器顯示IP係`100.x.y.z`既話就極有可能係）。CGNAT係國外較常見；就我理解，香港駁網線或光纖既寬頻唔會行CGNAT

如不幸地行緊CGNAT，可以試下聯絡寬頻供應商叫佢派Public IP比你（可能要加錢），或用IPv6（如寬頻供應商有派比你），或直接用其他唔需Port forwarding既方法。

如果唔想記屋企Public IP或避免IP浮動產生問題，可以買個域名及設定DDNS，或者用免費DDNS服務（[DuckDNS](https://www.duckdns.org/)/[Synology DDNS](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_ddns)）。
{{< /notice >}}

### QuickConnect/MyQnapCloud

部分NAS牌子提供免費中繼Server，例如Synology既[QuickConnect](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_quickconnect)同QNAP既[MyQnapCloud](https://www.qnap.com/zh-hk/software/myqnapcloud)。

因為我得Synology，呢到只講QuickConnect：

**無需做Port forwarding**，靠Synology server做Hole punching，或（如失敗）用Synology中繼Server做中間人連結部NAS同你部手機/電腦。[（QuickConnect原理）](https://kb.synology.com/zh-tw/WP/Synology_QuickConnect_White_Paper/4)

注意用QuickConnect只能掂到DSM及部分Synology App，冇辦法透過佢開NAS上既Plex/Jellyfin等你自己裝既App。

### Cloudflare Tunnel

即Cloudflare做中間人幫你放Service出街。**無需做Port forwarding**。

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)本身係免費，但你要有一個[Nameserver係Cloudflare既域名](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)先用到。

用佢既好處係可以獲得Cloudflare既DDOS保護；此外亦支持用第三方授權，例如用Google，咁可以指定某啲Gmail帳號持有人先存取到到你啲野。

{{< notice warning "注意" >}}
你要信Cloudflare，呢個[算係Man in the middle](https://www.reddit.com/r/selfhosted/comments/17ogchd/cloudflare_tunnels_privacy/)，佢有方法睇到曬你啲流量既所有內容。

此外，用Cloudflare Tunnel做媒體串流或大檔案傳輸可能違反佢地既服務條款，除非你[將啲檔案放上佢地平台再傳輸](https://blog.cloudflare.com/updated-tos/)。

[延伸閱讀：類似Cloudflare Tunnel方案一覽](https://github.com/anderspitman/awesome-tunneling)
{{< /notice >}}

## 放部NAS出街時，要點保障自己？

**用VPN並確保VPN版本更新**。除非真係要放比街外人用，否則只用VPN。

如果唔用VPN而選擇直接做Port forwarding放出公海，我有以下建議：

- **重要數據做好備份**，亦要有至少一份**即使被Hack黑客都掂唔到**既備份。
- 開個權限唔多既帳號比自己平時用，非必要唔用管理員帳號
- 路由器或NAS既防火牆封鎖中國及俄羅斯既Inbound IP，或直接封鎖香港以外所有Inbound IP
- Port forwarding唔好用常見既Port（如22、80、443、445、3389），用啲怪數字
- Port forwarding只放反向代理（Reverse proxy），如NGINX、Caddy等；同時買個域名或用免費DDNS，再[攞個SSL憑證](#點樣獲得免費既ssl憑證)行HTTPS
- 如有VLAN功能既交換機及勁少少既防火牆（較新既家用路由器裝OpenWrt可以做曬兩樣野）：鎅個VLAN做DMZ，將需要放出街既Service全部放入去，並嚴格限制其對其他VLAN既存取權
- 上網講野小心啲，唔好成為黑客或國家機關既攻擊目標 :shushing_face:

{{< detail "點樣備份先可以「即使被Hack黑客都掂唔到」？" >}}
必須有至少一份**即使被Hack黑客都掂唔到**既備份。例子：

1. 定時將外置硬碟接駁NAS做備份，做好後斷開外置硬碟連接（即離線備份）
2. 由備份Server主動從NAS撈數據做備份（而唔係NAS主動倒數據落備份Server），且禁止網絡其他機主動存取備份Server
3. 備份Server只接受上傳備份，禁止刪除或更改舊既備份

如果黑客攻到入黎，又掂到曬你啲備份，咁佢直接剷曬或加密曬咪得。咁樣你既備份形同虛設。
{{< /detail >}}

只放VPN出街既好處（相比起個個Service都放出街）係你將黑客可以攻擊既地方減至最小（得VPN可以攻擊）。

VPN將安全性放第一，只要設定得當就非常難以攻破，而且有漏洞都好快有修復（所以要保持VPN更新）。

好多Service假設咗你將佢放係可信任既網絡入面，佢地冇咁著重安全性，你放佢出公海就會提高自己被黑客攻破既風險。

{{< notice tip "Port forwarding 小知識" >}}
Port forwarding本身並無任何風險，所有風險都來自你Forward出去既Service本身既安全性強弱。

例如放VPN係十分安全，但你放QNAP NAS個網頁介面出去可能好快就出事。

同樣道理，如果你完全信任某個Service既安全性，咁我唔會反對你直接做Port forwarding放佢出街。

最緊要係要明白放各種Service出街既風險，同埋要為最壞情況做好準備。
{{< /notice >}}

{{< figure src="./Security.jpg" caption="唔注意安全既後果:laughing:" >}}

## 點樣獲得免費既SSL憑證？

[Let's Encrypt](https://letsencrypt.org/)係一間免費提供SSL憑證既既非牟利機構，好多家用Server玩家都用佢地既憑證。

佢地提供[幾種方法](https://letsencrypt.org/docs/challenge-types/)比你證明你擁有個域名。我推薦**DNS-01**方法，因為：

1. 唔洗放Port都行到
2. 可以攞Wildcard憑證（例如`*.<子網域名>.duckdns.org`）

**DNS-01**要你個[DNS provider支持先用到](https://community.letsencrypt.org/t/dns-providers-who-easily-integrate-with-lets-encrypt-dns-validation/86438)。其中DuckDNS同Cloudflare值得一提，前者係免費，後者有[Cloudflare Tunnel可以玩](#cloudflare-tunnel)。

Let's Encrypt既SSL憑證**有效期只有90日**，佢地建議每60日更新一次憑證。

有唔少[工具](https://letsencrypt.org/docs/client-options/)可以幫你管理及更新Let's Encrypt既SSL憑證；[OpenWrt](https://openwrt.org/docs/guide-user/services/tls/acmesh/)/[pfSense](https://docs.netgate.com/pfsense/en/latest/packages/acme/index.html)等OS有插件幫你做；用Docker既玩家可以睇下[Nginx Proxy Manager](https://github.com/NginxProxyManager/nginx-proxy-manager)/[Caddy](https://github.com/caddyserver/caddy/)。

{{< notice tip "Let's Encrypt 妙用" >}}
有啲Service一定要HTTPS先運作到（如[Vaultwarden](https://github.com/dani-garcia/vaultwarden)），咁樣就算你只係屋企或純經VPN用，都係要搞SSL憑證。

一個可行方案係自己整自我簽署憑證(Self-signed Certificate)。自我簽署憑證[原則上係不可信](https://security.stackexchange.com/questions/112768/why-are-self-signed-certificates-not-trusted-and-is-there-a-way-to-make-them-tru)（所以Vaultwarden唔會認），你要係每部會用呢個Service既電腦/手機到載入個SSL憑證先可以正常用到。

更佳做法係用Let's Encrypt：Let's Encrypt係受國際信任既憑證頒發機構（Certificate Authority），正常電腦/手機出廠已預設會信佢地既SSL憑證，唔洗上面咁自己載入憑證先用到個Service。

只要用佢地既DNS-01方法就可以唔開Port都申請到SSL憑證，攞到後係反向代理設定好就得。

[延伸閱讀：Run a private vaultwarden with Let's Encrypt certs](https://github.com/dani-garcia/vaultwarden/wiki/Running-a-private-vaultwarden-instance-with-Let%27s-Encrypt-certs)（唔用Vaultwarden都值得一睇）
{{< /notice >}}

{{< notice warning "必須保護 SSL 憑證密鑰" >}}
SSL憑證有兩個檔案，其中一個係密鑰。你要保護密鑰不被外人得到，唔可以將密鑰分享比陌生人。

[呢到](https://security.stackexchange.com/a/16694)有講SSL憑證密鑰被偷既話有咩可能既後果，以及被偷後要點處理。
{{< /notice >}}

## 咩係轉碼（Transcode）？

一個媒體播放器（如你部電視個瀏覽器）通常唔係支持所有媒體格式（影片格式、音頻格式、字幕格式等）。

如果播放器支持你想播條片既格式，咁部NAS直接經網絡傳輸條片比個播放器就得（即Direct Play）。咁樣部NAS唔洗點做野。

但如果格式不合，有兩個選項：

### NAS轉碼:film_strip:

你部NAS要將條片先轉碼做合適既格式，再傳輸比播放器。咁樣會燒部NAS隻CPU。

如果你隻NAS有Hardware encoder+decoder既話，部NAS就會將轉碼工作掉比佢地去做。

咁樣NAS隻CPU既負荷（相比起冇Encoder+decoder既情況）會大大降低，唔會因為播片而卡死部NAS。

通常大牌子NAS既Intel CPU有內顯（有啲型號甚至有獨立顯示卡），內有Hardware encoder+decoder。

{{< notice tip "轉換影片解析度" >}}
將片轉做唔同解析度（例如4K轉去1080p）都係轉碼既一種，想係街用流量睇屋企4K片既話有用。

另一個做法係下載曬同一個影片既高清版同標清版，出街時直接睇標清版，咁就唔洗轉碼。
{{< /notice >}}

### 換媒體播放器:tv:

例如買隻機頂盒或TV stick插上電視轉輸入源，用佢地做播放器。

機頂盒：[Nvidia Shield](https://www.nvidia.com/zh-tw/shield/) :thumbsup:、[Apple TV](https://www.apple.com/hk/tv-home/)、各類Android TV Box等

TV stick：[Google Chromecast](https://store.google.com/tw/product/chromecast_google_tv)、[Roku](https://www.roku.com/products/players)、[Amazon Fire TV](https://www.amazon.com/s?bbn=8521791011&rh=n%3A16333372011%2Cn%3A2102313011%2Cn%3A8521791011%2Cn%3A21579967011&dc&rnid=8521791011)等

呢啲產品通常支持更多檔案格式。買邊隻請自己做功課，或去我地Post討論。

另外：如果你用緊PC/手機/電視瀏覽器睇片唔Work既話，可以試下用Plex/Jellyfin既原生App或[VLC](https://www.videolan.org/)。

{{< detail "轉碼知多啲" >}}
你啲片既格式（MP4/MKV/WebM等）其實係Container格式黎，佢地入面裝住咗Video/Audio/Subtitle，三者分別有自己獨特既格式。

轉碼其實就係將你條原片既Video/Audio/Subtitle **Decode（解碼）** 去Raw，再**Encode（編碼）** 去你媒體播放器播放到既格式，最後再將成品經網絡傳輸比個媒體播放器。

所以你NAS/轉碼器要有你**原片格式既Decoder**及**媒體播放器可播放格式既Encoder**。

[延伸閱讀：Jellyfin Codec Support及介紹](https://jellyfin.org/docs/general/clients/codec-support/)
{{< /detail >}}

## 有用網站

[HKEPC（有NAS同Networking討論區）](https://www.hkepc.com/forum/)

[Reddit：r/Synology](https://www.reddit.com/r/synology/)

[Reddit：r/Qnap](https://www.reddit.com/r/qnap/)

[Reddit：r/DataHoarder](https://www.reddit.com/r/DataHoarder/)

## [按我進入下一章](../004_lihkg_docker/)

## [返回主目錄](../../categories/連登homelab系列/)
