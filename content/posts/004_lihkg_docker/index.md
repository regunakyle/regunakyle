+++
title = "連登Homelab系列（二）：Docker常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for Docker"
categories = ["連登Homelab系列"]
date = "2024-01-21"
+++

{{< css "/css/chinese.css" >}}

## [按我返回上一章](../003_lihkg_consumer_nas/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年2月17日）

{{< figure src="./Cover.webp" >}}

## Docker係咩黎？有咩咁勁？

Docker可以將唔同既程式連埋所需既野一次過打包做一舊，然後你禁幾粒掣或行幾條Script就可以用佢，可以當係App Store既App咁。

冇Docker之前同一部機想行唔同程式可能遇到相容性問題（例如兩個程式要用同一款但又唔同版本既Library，又或者S牌DSM個Library版本太舊）。Docker完美解決咗呢個問題，成件打包用就得。

注意其實Docker做到既野虛擬機都做到，不過虛擬機比Docker燒CPU/RAM。

**另外要玩Docker的話強烈建議加RAM**。

## 咩機支持Docker?

Synology既話Plus系列或較新既非Plus機種都有支持。[呢到](https://www.synology.com/zh-tw/dsm/packages/ContainerManager)可以睇適用機種。

注意只有Plus系列先有得加RAM；此外非Plus機種用ARM CPU未必支持到全部Docker Image。

其他牌子請自己Google:stuck_out_tongue:

## 用Docker要注意啲咩？

**盡量避免以Root身份行Docker**。

Docker預設係以Root身份行。咁既話出現Container escape時隻Container就可以對你部機為所欲為。

**最好起一個User專用黎行Docker野**，並起個文件夾比呢個User專用，其他檔案有需要先比權限佢掂。

然後[Docker --user flag選擇呢個user既UID：GID去行](https://docs.docker.com/engine/reference/run/#user)。

{{< notice warning "注意" >}}
有啲Docker image只支持用Root行。

我建議任何Docker image都試下用Non-root user行下先，唔得再用Root。
{{< /notice >}}

## Docker有咩好玩?

### 自製Netflix :thumbsup:

{{< figure src="./Jellyfin.jpg" caption="Jellyfin介面" >}}

軟件：

- 影音管理/播放器：[Plex](https://hub.docker.com/r/plexinc/pms-docker/)/[Jellyfin](https://hub.docker.com/r/jellyfin/jellyfin)
- 影音搜索/下載管理：[Sonarr](https://hotio.dev/containers/sonarr/)/[Radarr](https://hotio.dev/containers/radarr/)
- 種子來源整合器：[Prowlarr](https://hotio.dev/containers/prowlarr/)
- 下載器：[（BitTorrent）qBittorrent](https://hotio.dev/containers/qbittorrent/)/[（Usenet）Sabnzbd](https://hub.docker.com/r/linuxserver/sabnzbd/)
- 字幕下載器：[ChineseSubFinder](https://hub.docker.com/r/allanpk716/chinesesubfinder)/[Bazarr](https://hotio.dev/containers/bazarr/)

Selfhost圈子入面最熱門既內容。

用家先係Sonarr/Radarr指定想睇咩劇集/電影，然後Sonarr/Radarr去唔同網站撈Seed（Prowlarr做Seed整合），再叫qBittorrent去下載，下載完就可以係Plex/Jellyfin到睇。

[延伸閱讀：Synology Docker Media Server安裝教學](https://trash-guides.info/Hardlinks/How-to-setup-for/Synology/)

[延伸閱讀：想討論PT (Private tracker)](https://lih.kg/2447243)

### 全家過濾廣告 :thumbsup:

{{< figure src="./AdguardHome.png" caption="AdguardHome介面" >}}

軟件：[AdGuardHome](https://hub.docker.com/r/adguard/adguardhome)/[PiHole](https://github.com/pi-hole/docker-pi-hole)

DNS層過濾廣告，同時亦可做家長監控（即是封鎖你指定既網頁）。

安裝後再係Router到設定個DNS server做佢，咁成個屋企網絡既機器都會過濾到廣告。

有興趣既話可以研究埋[Unbound](https://unbound.docs.nlnetlabs.nl/en/latest/)（Recursive DNS）或者DNS-over-HTTPS/DNS-over-TLS（Encrypted DNS）。前者可以[增強私隱](https://docs.pi-hole.net/guides/dns/unbound/#what-does-this-guide-provide)，後者可保證你寬頻供應商無法篡改你既DNS query。

{{< notice info "檢查寬頻供應商有冇攔截你 DNS request" >}}
先去Router設定DNS server做[1.1.1.1](https://1.1.1.1/)，再去[呢到](https://www.dnsleaktest.com)做測試。

如顯示既ISP唔係Cloudflare，你就知道你既DNS request比你個寬頻供應商攔截及篡改咗。

注意：Encrypted DNS只能保證你DNS request不被第三方偷窺及篡改。

寬頻供應商仍然可以其他方式干預你既網絡，例如直接封鎖你要去既網站既IP。

 {{< /notice >}}

### Server儀表板 :thumbsup:

{{< figure src="./Dashy.jpg" caption="Dashy介面" >}}

軟件：[Homepage](https://github.com/gethomepage/homepage)/[Dashy](https://github.com/Lissy93/dashy)/[Heimdall](https://github.com/linuxserver/Heimdall)/[Homer](https://github.com/bastienwirtz/homer)

當你自己Host一堆Service時，好難記得曬每個Service既IP:Port係咩。

用呢啲儀表板可以將自己Service既IP:Port放曬係同一個地方，以後忘記既話入去Click就得。

非常適合諗住將啲Service分享比屋企人/朋友用既人。

### 自製筆記App

{{< figure src="./Joplin.png" caption="Joplin介面" >}}

軟件：[Joplin](https://github.com/laurent22/joplin)/[Trilium](https://github.com/zadam/trilium)/[Logseq](https://github.com/logseq/logseq)/[Memos](https://github.com/usememos/memos)

各類筆記App，可以逐個逐個裝黎試下，睇下邊款岩用。

Synology自己都有[Note Station](https://www.synology.com/en-global/dsm/feature/note_station)。

如果你用[Obsidian](https://obsidian.md/)既話，可以自己Host個CouchDB做[Live sync](https://github.com/vrtmrz/obsidian-livesync/)。

### 將得USB連接既打印機/掃描器變成屋企網絡可用

{{< figure src="./Scanservjs.jpg" caption="Scanservjs介面" >}}

軟件：[（打印）CUPS](https://openprinting.github.io/cups/)/[（掃描）Scanservjs](https://github.com/sbs20/scanservjs)

如果你同我一樣有部得USB既陳年多合一打印機，又或者係一定要裝垃圾軟件先用到既打印機，呢兩個App可以幫到你。

只要連接打印機同裝住呢兩個App既Server，成個屋企網絡既機就可以透過呢兩個App用隻打印機/掃描器，唔洗裝任何其他App。

不過視乎你部打印機既型號，有可能要你自己搵部機既Linux driver並安裝後先行到呢兩個App。

### ChatGPT/Midjourney翻版

{{< figure src="./Oobabooga.png" caption="Text-generation-webui介面" >}}

軟件：[（Gen圖）stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)/[（Gen字）text-generation-webui](https://github.com/oobabooga/text-generation-webui)

行AI你先要下載個Model，再係對應既App到載入就可以用：

[CivitAI（Gen圖Model下載）](https://civitai.com/)

[Huggingface：TheBloke（Gen字Model下載）](https://huggingface.co/TheBloke)

呢兩個App都有API，識寫程式既話可以睇下。

自己Host AI既最大賣點係冇Censorship，你問佢[幾邪惡既野都會答你](https://www.reddit.com/r/LocalLLaMA/comments/149su0a/a_short_conversation_with_falcon/)。此外亦可保障私隱。

你部品牌NAS行AI應該有困難。如果有興趣既話，可以考慮下自組Server行。

[延伸閱讀：r/StableDiffusion](https://www.reddit.com/r/StableDiffusion/)

[延伸閱讀：r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)

### 其他有趣Software

:thumbsup: 一個介面控制屋企智能家具（[Home Assistant](https://www.home-assistant.io/)）

:thumbsup: 跨平台Airdrop翻版（[PairDrop](https://github.com/schlagmichdoch/PairDrop)）

:thumbsup: 電子書下載及管理（[LazyLibrarian](https://lazylibrarian.gitlab.io/)，[Calibre](https://docs.linuxserver.io/images/docker-calibre/)，[Calibre-web](https://github.com/janeczku/calibre-web)）

翻牆工具（[V2Ray](https://www.v2ray.com/)/[XRay](https://xtls.github.io/)）

自製Onedrive（[Nextcloud](https://nextcloud.com/athome/)/[Syncthing](https://github.com/syncthing/syncthing)）

Google Photo翻版（[Immich](https://github.com/immich-app/immich)/[Photoprism](https://github.com/photoprism/photoprism)）

自製記帳App（[Firefly III](https://github.com/firefly-iii/firefly-iii)/[Actual Budget](https://github.com/actualbudget/actual)）

偵測特定網頁更新（[Changedetection.io](https://github.com/dgtlmoon/changedetection.io)）

[Game Server](https://github.com/GameServerManagers/docker-gameserver)（ARK/Barotrauma/CS2/Factorio/Minecraft/Palworld/Terraria/TF2等等，太多不能盡錄）

各類Discord/Telegram bot（例如[Discord播歌Bot](https://github.com/SudhanPlayz/Discord-MusicBot)/[Telegram加密貨幣交易Bot](https://github.com/freqtrade/freqtrade)）

自動Steam掛卡（[Archisteamfarm](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Docker)）

Grammarly翻版（[Languagetool](https://github.com/languagetool-org/languagetool)）

## 有用網站

[This Week in Self-Hosted](https://selfh.st/)（Self host軟件新聞）

[Github：Awesome Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

[Reddit：r/Selfhosted](https://www.reddit.com/r/selfhosted/)

## [按我進入下一章](../005_lihkg_homelab/)

## [返回主目錄](../../categories/連登homelab系列/)
