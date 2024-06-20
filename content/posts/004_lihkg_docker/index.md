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

（本文最後更新時間：2024年3月9日）

{{< figure src="./Cover.webp" >}}

## Docker係咩黎？有咩咁勁？

[Docker](https://docs.docker.com/get-started/overview/)可以將有用程式及佢所需既野一次過打包做一舊，只需行一條Script就可以用佢，非常方便。

冇Docker時同一部機想行唔同程式可能遇到相容性問題（例如兩個程式要用同一款但唔同版本既Library，又或者Synology DSM個Library版本太舊）。Docker完美解決咗呢個問題，成件打包用就得。

其實Docker做到既野虛擬機都做到，不過虛擬機比Docker用更多CPU及RAM。

**要玩Docker的話強烈建議加RAM**。

## 咩機支持Docker?

Synology既話Plus系列或較新既非Plus機種都有支持。[呢到](https://www.synology.com/zh-tw/dsm/packages/ContainerManager)可以睇適用機種。

注意非Plus機種用ARM架構既CPU，可能行唔到某啲Docker映像（Image）。

其他牌子請自己Google:stuck_out_tongue:

## 用Docker要注意啲咩？

### 只用軟件官方或知名團體提供既既Docker映像

用網上既Docker映像本質上同用陌生人既EXE檔冇咩分別，所以要用官方或其他可信團體整既版本。

例如[Linuxserver.io](https://www.linuxserver.io/)及[Hotio](https://hotio.dev/)既Docker映像都多人用，軟件官方冇出Docker版既話可以先睇佢地。

更好既做法係自己撈Source code落黎構建個Docker映像，但可惜唔係人人都識或想自己做。

Docker本身會提供一定保護，例如你冇Mount volume既話容器（Container）係存取唔到個宿主機既檔案，但有惡意既容器仲可以用其他方法攻擊你，例如行掘礦程式，又或者嘗試破解屋企網絡入面既其他Service。

{{< notice info "Docker名詞解釋" >}}
**映像（Image）** 係容器既藍圖，入面有齊曬個軟件運行需要既東西。Docker會根據呢個藍圖去複製及產出容器。

**容器（Container）** 係實際行緊既程式，由映像產生出黎。一個映像可以生成多個同一樣既容器。

可以類比：映像係印鈔機，容器係實際印出黎既鈔票。

{{< /notice >}}

### Docker既安全貼士

Docker預設係以Root身份行。咁既話出現*容器逃逸*時隻容器就可以對你部機為所欲為。

雖然咁講，但只要唔用`--privileged`行既話，Docker本身既保護都強，*容器逃逸*唔係咁易發生。

但為咗減低風險，**最好起一個User專用黎行Docker野**，並起個文件夾比呢個User專用，其他檔案有需要先比權限佢掂。

然後Docker加兩個Flag行：`--user <新User UID>:<新User GID>` `--security-opt=no-new-privileges`

Synology用家可以睇[呢個教學](https://trash-guides.info/Hardlinks/How-to-setup-for/Synology/)，有整Docker專用User及整Docker版Media server既步驟。

{{< notice warning "注意" >}}
有啲Docker映像只支持用Root行。

我建議任何Docker映像都試下用以上兩個Flag行下先（可能要搞好多野先用到），實在搞唔掂再用Root行。

[呢到](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)有個Docker安全性貼士清單，可以按自己需要再加入面講既Flag行Docker。
{{< /notice >}}

## 唔想打Command，有冇比較容易操作既Docker管理介面？

Synology DSM最新既[Container Manager](https://kb.synology.com/zh-hk/DSM/help/ContainerManager/docker_desc)比以前個版本改善咗好多，加咗Docker Compose支持，基本上已足夠絕大部分情況使用。

如果用緊較舊版本既DSM，或用緊其他牌子NAS又想要好啲既介面，可以睇下[Portainer](https://github.com/portainer/portainer)。

呢到簡單講下點樣安裝Portainer：

（以下用Synology DSM 7做例，但只要有Docker及Docker Compose既機都適用）

1. 以管理員帳號身份登入DSM，係其他User存取唔到既地方（例如管理員帳號既`home`文件夾）到開個文件夾，名稱隨意（例如`Portainer`）

2. 搵部電腦整個`compose.yaml`檔案，內容如下：

```yaml
# compose.yaml
services:
  portainer-ce:
    container_name: portainer-ce
    image: portainer/portainer-ce:latest
    ports:
       - "9443:9443"
       ## Portainer支持Port 9000行HTTP。如有需要用HTTP，可將下一行既#號刪除
       #- "9000:9000" 
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/data
    restart: unless-stopped

networks:
  default:
     name: portainer-ce-network
```

3. 將`compose.yaml`上傳至NAS頭先新開既文件夾

4. 係新開文件夾入面開個`data`文件夾

做曬以上後應該睇到係咁樣：

{{< figure src="./Synology.jpg" >}}

然後要行Command。有幾種方法（例如網上有人用DSM個[任務排程表](https://kb.synology.com/zh-hk/DSM/help/DSM/AdminCenter/system_taskscheduler)行），我呢到只講SSH：

1. 係NAS介面開啟SSH服務，並用管理員帳號SSH入去（[Synology教學](https://kb.synology.com/zh-hk/DSM/tutorial/How_to_login_to_DSM_with_root_permission_via_SSH_Telnet)/[QNAP教學](https://www.qnap.com/zh-tw/how-to/faq/article/how-to-access-qnap-nas-by-ssh)）

2. 係SSH入面用`cd`指令走入去上部分第一步開既文件夾

提示：

- 用`ls -al`指令睇當下文件夾有咩野
- 用`pwd`指令睇而家係邊個文件夾
- 用`cd <文件夾名稱>`指令入去另一個文件夾
  - 用`cd ..`指令去上一層文件夾
  - 用`cd /`指令返去最上層文件夾
  - 用`cd`指令（後面唔加野）可返回當前SSH帳號既`home`文件夾

{{< figure src="./SSH.png" caption="入到有齊data文件夾同compose.yaml既文件夾" >}}

1. 打以下指令其中一個以啟動Portainer（如果佢問你密碼，你照入返就得）

- `sudo docker compose up -d`
- `sudo docker-compose up -d`（Synology要用呢個）

{{< figure src="./Compose.png" >}}

4. 用電腦瀏覽器打`https://<NAS IP>:9443`去到Portainer介面，入去跟佢指引做就得

{{< figure src="./Portainer.png" caption="設定密碼後入去按Get Started即可" >}}

以後如果想停止Portainer，同樣SSH入去並`cd`入`compose.yaml`所在文件夾打以下指令其一：

- `sudo docker compose down`
- `sudo docker-compose down`（Synology要用呢個）

最後，如果將來唔再需要用SSH，可以去NAS介面將SSH服務停咗佢。

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

用家先係Sonarr/Radarr指定想睇咩劇集/電影，然後Sonarr/Radarr去唔同網站撈種（Prowlarr做種子整合），再叫qBittorrent去下載，下載完就可以係Plex/Jellyfin到睇。

[延伸閱讀：Sonarr/Radarr官方文檔](https://lih.kg/2447243)

{{< notice tip "Private tracker" >}}
最新既電影/劇集等比較容易係公海撈到種，而較舊或冷門既資源可能好難搵。

有興趣既玩家可以研究下Private tracker（PT）。大既PT站資源較齊，較易搵到冷門或較舊既資源。

PT唔係直接就入到會，可能要你課金（中國大陸/台灣個啲），又或者要現有會員出邀請比你。

另外PT通常禁止會員只下載不上傳，上傳得太少可能會被踢走。有玩家甚至會整Seedbox專做PT。

{{< /notice >}}

### 全家過濾廣告 :thumbsup:

{{< figure src="./AdguardHome.png" caption="AdguardHome介面" >}}

軟件：[AdGuardHome](https://hub.docker.com/r/adguard/adguardhome)/[PiHole](https://github.com/pi-hole/docker-pi-hole)

DNS層過濾廣告，同時亦可做家長監控（即是封鎖你指定既網頁）。

安裝後再係路由器到設定個DNS server做佢，咁成個屋企網絡既機器都會過濾到廣告。

有興趣既話可以研究埋[Unbound](https://unbound.docs.nlnetlabs.nl/en/latest/)（Recursive DNS）或者DNS-over-HTTPS/DNS-over-TLS（Encrypted DNS）。前者可以[增強私隱](https://docs.pi-hole.net/guides/dns/unbound/#what-does-this-guide-provide)，後者可保證你寬頻供應商無法篡改你既DNS query。

{{< notice tip "檢查寬頻供應商有冇篡改你 DNS 請求" >}}
先去路由器設定DNS server做[1.1.1.1](https://1.1.1.1/)，再去[呢到](https://www.dnsleaktest.com)做測試。

如顯示既ISP唔係Cloudflare，即可斷定你既DNS請求比你個寬頻供應商攔截及篡改咗。

注意：Encrypted DNS只能保證你既DNS請求不被第三方偷窺及篡改。

寬頻供應商仍然可以用其他方法干預你既網絡，例如直接封鎖你要去既網站既IP。
{{< /notice >}}

### Server儀表板 :thumbsup:

{{< figure src="./Dashy.png" caption="Dashy介面" >}}

軟件：[Homepage](https://github.com/gethomepage/homepage)/[Dashy](https://github.com/Lissy93/dashy)/[Heimdall](https://github.com/linuxserver/Heimdall)/[Homer](https://github.com/bastienwirtz/homer)

行一堆Service時好難記得曬每個Service既IP:Port係咩。

用呢啲儀表板可以將唔同Service既IP:Port標記曬係同一個地方，以後忘記既話入去㩒就得。

非常適合諗住將啲Service分享比屋企人/朋友用既人。

### 自製筆記軟件

{{< figure src="./Joplin.png" caption="Joplin介面" >}}

軟件：[Joplin](https://github.com/laurent22/joplin)/[Trilium](https://github.com/zadam/trilium)/[Logseq](https://github.com/logseq/logseq)/[Memos](https://github.com/usememos/memos)

各類筆記軟件，可以逐個逐個裝黎試下，睇下邊款岩用。

Synology自己都有[Note Station](https://www.synology.com/en-global/dsm/feature/note_station)。

如果你用[Obsidian](https://obsidian.md/)既話，可以自己起個CouchDB做[Live sync](https://github.com/vrtmrz/obsidian-livesync/)。

### 將得USB連接既打印機/掃描器變成屋企網絡可用

{{< figure src="./Scanservjs.jpg" caption="Scanservjs介面" >}}

軟件：[（打印）CUPS](https://openprinting.github.io/cups/)/[（掃描）Scanservjs](https://github.com/sbs20/scanservjs)

如果你同我一樣有部得USB既陳年多合一打印機，又或者係一定要裝垃圾軟件先用到既打印機，咁呢兩個軟件可以幫到你。

只要連接打印機同裝住呢兩個軟件既Server，成個屋企網絡既機就可以透過呢兩個軟件用隻打印機/掃描器，唔洗裝任何其他軟件。

不過視乎你部打印機既型號，有可能要你自己搵部打印機既Linux版驅動程式並安裝後先行到呢兩個軟件。

### ChatGPT/Midjourney翻版

{{< figure src="./Oobabooga.png" caption="Text-generation-webui介面" >}}

軟件：[（Gen圖）stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)/[（Gen字）text-generation-webui](https://github.com/oobabooga/text-generation-webui)

行AI你先要下載個Model，再係對應既軟件到載入就可以用。

呢兩個軟件都有API，識寫程式既話可以睇下。

自己行AI既最大賣點係冇Censorship，你問佢[幾邪惡既野都會答你](https://www.reddit.com/r/LocalLLaMA/comments/149su0a/a_short_conversation_with_falcon/)。此外亦可[保障私隱](https://www.schneier.com/blog/archives/2024/02/microsoft-is-spying-on-users-of-its-ai-tools.html)。

你部品牌NAS行AI應該有困難。如果有興趣既話，可以考慮下自組Server行。

[延伸閱讀：CivitAI（Gen圖Model下載）](https://civitai.com/)

[延伸閱讀：r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)

### 其他有趣軟件

:thumbsup: 一個介面控制屋企既智能家具（[HomeAssistant](https://www.home-assistant.io/)）

:thumbsup: 電子書下載及管理（[LazyLibrarian](https://lazylibrarian.gitlab.io/)，[Calibre](https://docs.linuxserver.io/images/docker-calibre/)，[Calibre-web](https://github.com/janeczku/calibre-web)）

翻牆工具（[V2Ray](https://www.v2ray.com/)/[XRay](https://xtls.github.io/)）

自製Onedrive（[Nextcloud](https://nextcloud.com/athome/)/[Syncthing](https://github.com/syncthing/syncthing)）

Google Photo翻版（[Immich](https://github.com/immich-app/immich)/[Photoprism](https://github.com/photoprism/photoprism)/[Photoview](https://github.com/photoview/photoview)）

自製記帳App（[Firefly III](https://github.com/firefly-iii/firefly-iii)/[Actual Budget](https://github.com/actualbudget/actual)）

偵測特定網頁更新（[Changedetection.io](https://github.com/dgtlmoon/changedetection.io)）

[Game Server](https://github.com/GameServerManagers/docker-gameserver)（ARK/Barotrauma/CS2/Factorio/Minecraft/Palworld/Terraria/TF2等等，太多不能盡錄）

各類Discord/Telegram bot（例如[Discord播歌Bot](https://github.com/SudhanPlayz/Discord-MusicBot)/[Telegram加密貨幣交易Bot](https://github.com/freqtrade/freqtrade)）

自動Steam掛卡（[Archisteamfarm](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Docker)）

Grammarly翻版（[Languagetool](https://github.com/languagetool-org/languagetool)）

## 有用網站

[Reddit：r/Selfhosted](https://www.reddit.com/r/selfhosted/)

[Github：Awesome Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

[This Week in Self-Hosted](https://selfh.st/)（Self host軟件新聞）

## [按我進入下一章](../005_lihkg_homelab/)

## [返回主目錄](../../categories/連登homelab系列/)
