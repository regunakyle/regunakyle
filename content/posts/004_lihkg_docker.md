+++
title = "連登Homelab系列：Docker常見問題"
author = "Eric Leung"
description = "LIHKG Homelab Post series: FAQ for Docker"
categories = ["連登Homelab系列"]
date = "2024-01-21"
+++

## [按我返回上一章](../003_lihkg_consumer_nas/)

## [返回主目錄](../../categories/連登homelab系列/)

（本文最後更新時間：2024年1月23日）

## Docker係咩黎？有咩咁勁？

{{< svg "static/images/blog/004/docker.svg" >}}

Docker可以將唔同既程式連埋所需既野一次過打包做一舊，然後你禁幾粒掣or行幾條Script就可以用佢，可以當係App Store既App咁。

冇Docker之前同一部機想行唔同程式可能遇到相容性問題（例如兩個程式要用同一款但又唔同版本既Library，又或者Synology DSM個library version太舊）。Docker完美解決左呢個問題，成件打包用就得。

注意其實Docker做到既野VM都做到，不過VM比Docker燒CPU/RAM。

**另外要玩Docker的話強烈建議加RAM**。

## 咩機支持Docker?

Synology既話Plus系列或較新既Non Plus機種都有支持。[呢到](https://www.synology.com/zh-tw/dsm/packages/ContainerManager)睇適用機種。

注意只有Plus系列先有得加RAM。此外Non Plus機種用ARM CPU未必支持到全部Docker Image。

其他牌子請自己Google:stuck_out_tongue:

## 用Docker要注意D咩?

盡量避免用Root行Docker.

By default Docker係以Root身份行container. 咁既話出現container escape時隻container就可以對你部機為所欲為.

最好起一個user專用黎行Docker野, 並起個folder比呢個user用, 其他野有需要先比佢掂,

然後Docker --user flag選擇呢個user既userid:groupid去行.

小知識: Red Hat有個Default non-root既Docker代替品叫Podman, 有興趣可以睇下.

## Docker有咩好玩?

### 自製Netflix

(Plex/Jellyfin/Emby, Sonarr/Radarr/Prowlarr, Qbittorrent/Deluge/Transmission, Overseer/Jellyseer)

Selfhost圈子入面最熱門既內容。

用家先係Sonarr/Radarr/Overseer/Jellyseer指定想睇咩片，佢地去唔同網站撈seed，

然後Qbittorrent/Deluge/Transmission收到就去download。Download完就可以係Plex/Jellyfin/Emby睇。

Synology Docker Media Server Setup教學
<https://trash-guides.info/Hardlinks/How-to-setup-for/Synology/>

### 全家Adblock (AdguardHome/PiHole)

DNS level過濾廣告，同時亦可做Parental control (Block你指定既網頁).

只要係Router到set個DNS server做佢, 咁成個home network所有devices都會過濾到廣告.

另外可以考慮setup埋DNS-over-HTTPS或DNS-over-TLS,，咁你既網絡供應商就睇唔到同改唔到你既DNS query.

### Game Server

<https://github.com/GameServerManagers/docker-gameserver>

唔洗點介紹啦,想同Friend圍內打機既話可以研究下.

如果玩家人數太多, 你部NAS可能Handle唔到, 咁可以開始考慮自組server了.

可以host既game有: Minecraft, L4D2, ARK, Barotrauma, CS:GO, Factorio, Terraria等等, 大量不能盡錄.

### ChatGPT/Midjourney翻版

有兩款: Gen圖AI同文字AI(即LLM: Large Language Model).

自己Host既原因: 無Censorship (可以任Gen色圖; LLM既話問佢點整炸彈都照答你) 、唔洗VPN、保障私隱.

行AI你先要下載個Model,再host個行AI model既software:

Gen圖用： <https://github.com/AUTOMATIC1111/stable-diffusion-webui>

LLM用： <https://github.com/oobabooga/text-generation-webui>

LLM既話唔洗GPU都行到, 只要RAM夠既話純CPU都得(關鍵字: llama.cpp).

不過唔洗旨意你隻NAS行到AI, 老老實實自組Server先玩到.

有用網站

<https://github.com/ggerganov/llama.cpp>

<https://civitai.com/> (AI Gen圖Model下載)

<https://www.reddit.com/r/LocalLLaMA/> (Self host LLM討論區)

<https://huggingface.co/TheBloke> (LLM Model下載)

其他有趣Software:

Smart Home (HomeAssistant)

將得USB連接既Printer/Scanner變成Wifi可用 (CUPS/Scanservjs)

電子書下載及管理 (LazyLibrarian/Readarr, Calibre, Calibre-web)

Airdrop翻版 (PairDrop)

Google Photo翻版(Immich/Photoprism)

翻牆工具 (V2Ray/XRay)

偵測特定網頁更新 (Changedetection.io)

自製記帳app (FireflyIII/ActualBudget)

自製筆記app (Joplin/Trilium/Logseq)

自製Cloud/Sync (Nextcloud/Syncthing)

各類Discord/Telegram Bot

自動Steam掛卡(Archisteamfarm)

Grammarly翻版(Languagetool)

延伸閱讀 (Github selfhosted software list)

<https://github.com/awesome-selfhosted/awesome-selfhosted>

## [按我進入下一章](../005_lihkg_homelab/)

## [返回主目錄](../../categories/連登homelab系列/)
