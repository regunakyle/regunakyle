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

（本文最後更新時間：2024年1月23日）

## Docker係咩黎？有咩咁勁？

{{< svg "Docker.svg" >}}

Docker可以將唔同既程式連埋所需既野一次過打包做一舊，然後你禁幾粒掣or行幾條Script就可以用佢，可以當係App Store既App咁。

冇Docker之前同一部機想行唔同程式可能遇到相容性問題（例如兩個程式要用同一款但又唔同版本既Library，又或者S牌DSM個library version太舊）。Docker完美解決左呢個問題，成件打包用就得。

注意其實Docker做到既野虛擬機都做到，不過虛擬機比Docker燒CPU/RAM。

**另外要玩Docker的話強烈建議加RAM**。

## 咩機支持Docker?

Synology既話Plus系列或較新既非Plus機種都有支持。[呢到](https://www.synology.com/zh-tw/dsm/packages/ContainerManager)睇適用機種。

注意只有Plus系列先有得加RAM。此外非Plus機種用ARM CPU未必支持到全部Docker Image。

其他牌子請自己Google:stuck_out_tongue:

## 用Docker要注意啲咩？

**盡量避免以Root身份行Docker**。

Docker預設係以Root身份行。咁既話出現Container escape時隻Container就可以對你部機為所欲為。

**最好起一個user專用黎行Docker野**，並起個Folder比呢個User用，其他野有需要先比佢掂。

然後[Docker --user flag選擇呢個user既UID：GID去行](https://docs.docker.com/engine/reference/run/#user)。

## Docker有咩好玩?

### 自製Netflix :thumbsup:

{{< figure src="./Jellyfin.png" caption="Jellyfin介面" >}}

軟件：

- 影音管理/播放器：[Plex](https://hub.docker.com/r/plexinc/pms-docker/)/[Jellyfin](https://hub.docker.com/r/jellyfin/jellyfin)
- 影音搜索/下載管理：[Sonarr](https://hotio.dev/containers/sonarr/)/[Radarr](https://hotio.dev/containers/radarr/)
- 種子來源整合器：[Prowlarr](https://hotio.dev/containers/prowlarr/)
- 下載器：[（BitTorrent）Qbittorrent](https://hotio.dev/containers/qbittorrent/)/[（Usenet）Sabnzbd](https://hub.docker.com/r/linuxserver/sabnzbd/)
- 字幕下載器：[ChineseSubFinder](https://hub.docker.com/r/allanpk716/chinesesubfinder)/[Bazarr](https://hotio.dev/containers/bazarr/)

Selfhost圈子入面最熱門既內容。

用家先係Sonarr/Radarr指定想睇咩劇集/電影，然後Sonarr/Radarr去唔同網站撈Seed（Prowlarr提供source list），再叫Qbittorrent去下載，下載完就可以係Plex/Jellyfin到睇。

[Synology Docker Media Server Setup教學](https://trash-guides.info/Hardlinks/How-to-setup-for/Synology/)

[延伸閱讀：想討論PT (Private tracker)](https://lih.kg/2447243)

### 全家Adblock :thumbsup:

{{< figure src="./AdguardHome.gif" caption="AdguardHome介面" >}}

軟件：[AdGuardHome](https://hub.docker.com/r/adguard/adguardhome)/[PiHole](https://github.com/pi-hole/docker-pi-hole)

DNS level過濾廣告，同時亦可做家長監控（即是封鎖你指定既網頁）。

Setup後再係Router到設定個DNS server做佢，咁成個屋企網絡既機器都會過濾到廣告。

有興趣既話可以研究埋[Unbound](https://unbound.docs.nlnetlabs.nl/en/latest/)（Recursive DNS）或者DNS-over-HTTPS/DNS-over-TLS。前者可以[增強私隱](https://docs.pi-hole.net/guides/dns/unbound/#what-does-this-guide-provide)，後者可保證你寬頻供應商無法更改你既DNS query。

[檢查你DNS有冇被騎劫](https://www.dnsleaktest.com)

### Server儀表板 :thumbsup:

{{< figure src="./Dashy.png" caption="Dashy介面" >}}

軟件：[Homepage](https://github.com/gethomepage/homepage)/[Dashy](https://github.com/Lissy93/dashy)/[Heimdall](https://github.com/linuxserver/Heimdall)/[Homer](https://github.com/bastienwirtz/homer)

當你自己Host一堆Service時，好難記得曬每個Service既IP:Port係咩。

用呢啲儀表板可以將自己Service bookmark曬，以後唔記得Link既時候入去Click就得。

非常適合諗住將啲Service分享比屋企人/朋友用既人。

### 自製筆記App

{{< figure src="./Joplin.png" caption="Joplin介面" >}}

軟件：[Joplin](https://github.com/laurent22/joplin)/[Trilium](https://github.com/zadam/trilium)/[Logseq](https://github.com/logseq/logseq)/[Memos](https://github.com/usememos/memos)

各類筆記App，可以逐個逐個裝黎試下，睇下邊款岩用。

Synology自己都有[Note Station](https://www.synology.com/en-global/dsm/feature/note_station)。

如果你用[Obsidian](https://obsidian.md/)既話，可以[自己Host個CouchDB做live sync](https://github.com/vrtmrz/obsidian-livesync/tree/main)。

### 將得USB連接既Printer/Scanner變成屋企網絡可用

{{< figure src="./Scanservjs.jpg" caption="Scanservjs介面" >}}

軟件：[（Print）CUPS](https://openprinting.github.io/cups/)/[（Scan）Scanservjs](https://github.com/sbs20/scanservjs)

如果你同我一樣有部得USB既陳年All-in-one printer，又或者係一定要裝垃圾軟件先用到既Printer，呢兩個App可以幫到你。

只要USB插住Host呢兩個App既機，成個屋企網絡既機都可以透過呢兩個App用隻Printer/Scanner，唔洗裝任何其他App。

不過視乎你部Printer型號，有可能需要你自己上網下載Driver去Build個Docker image，最差情況係用都用唔到。

### ChatGPT/Midjourney翻版

{{< figure src="./Oobabooga.png" caption="Text-generation-webui介面" >}}

軟件：[（Gen圖）stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)/[（Gen字）text-generation-webui](https://github.com/oobabooga/text-generation-webui)

有兩款：Gen圖AI同Gen字AI。要多謝[Stability AI](https://stability.ai/)同[Facebook](https://ai.meta.com/)令我地有免費AI玩。

自己Host既原因：無Censorship（LLM既話問佢點整炸彈都照答你）、唔洗買VPN、保障私隱。

行AI你先要下載個Model，再係對應既Web UI到Load就可以用：

[CivitAI（Gen圖Model下載）](https://civitai.com/)

[Huggingface：TheBloke（Gen字Model下載）](https://huggingface.co/TheBloke)

呢兩個Web UI都有API，識寫程式既話可以睇下。

你部品牌NAS行AI應該有困難。如果有興趣既話，可以考慮下自組Server行。

[Reddit：r/StableDiffusion](https://www.reddit.com/r/StableDiffusion/)

[Reddit：r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)

### 其他有趣Software

:thumbsup: 一個介面控制屋企智能家具（[Home Assistant](https://www.home-assistant.io/)）

:thumbsup: Airdrop cross-platform翻版（[PairDrop](https://github.com/schlagmichdoch/PairDrop)）

:thumbsup: 電子書下載及管理（[LazyLibrarian](https://lazylibrarian.gitlab.io/)，[Calibre](https://docs.linuxserver.io/images/docker-calibre/)，[Calibre-web](https://github.com/janeczku/calibre-web)）

翻牆工具（[V2Ray](https://www.v2ray.com/)/[XRay](https://xtls.github.io/)）

自製Cloud/Sync（[Nextcloud](https://nextcloud.com/athome/)/[Syncthing](https://github.com/syncthing/syncthing)）

Google Photo翻版（[Immich](https://github.com/immich-app/immich)/[Photoprism](https://github.com/photoprism/photoprism)）

自製記帳App（[Firefly III](https://github.com/firefly-iii/firefly-iii)/[Actual Budget](https://github.com/actualbudget/actual)）

偵測特定網頁更新（[Changedetection.io](https://github.com/dgtlmoon/changedetection.io)）

[Game Server](https://github.com/GameServerManagers/docker-gameserver)（ARK/Barotrauma/CS2/Factorio/Minecraft/Palworld/Terraria/TF2等等，太多不能盡錄）

各類Discord/Telegram Bot（例如[Discord播歌Bot](https://github.com/SudhanPlayz/Discord-MusicBot)/[Telegram加密貨幣交易Bot](https://github.com/freqtrade/freqtrade)）

自動Steam掛卡（[Archisteamfarm](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Docker)）

Grammarly翻版（[Languagetool](https://github.com/languagetool-org/languagetool)）

## 有用網站

[Github：Awesome Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

[Reddit：r/selfhosted](https://www.reddit.com/r/selfhosted/)

[This Week in Self-Hosted](https://selfh.st/)

## [按我進入下一章](../005_lihkg_homelab/)

## [返回主目錄](../../categories/連登homelab系列/)
