+++
title = "如何不靠淘寶在香港訂閱美國的AI/LLM服務"
author = "Eric Leung"
description = "無需淘寶，無需sms-activate（另有OpenWrt Policy Routing教學）"
date = "2024-12-16"
+++

{{< css "/css/chinese.css" >}}

{{< figure src="./Cover.png"  >}}

## 前言

相信大家都知道在中美貿易戰背景下，美國的AI/LLM相關服務不對中國及香港用戶開放。

現時香港人若想訂閱外國AI服務，就要先解決以下問題：

1. 支付方式
2. 外國電話號碼
3. 地域IP封鎖

就我理解，以上問題的對應主流解決辦法是：

1. 在淘寶或其他網店付費代充值
2. 使用 [sms-activate](https://sms-activate.guru/)或類似服務接收手機驗證碼
3. 使用付費VPN繞過地域封鎖

(1)及(2)雖簡單直接，但我個人不喜歡使用這種第三方服務，畢竟控制權並非完全在自己手中。於是我花了點時間研究其他解決方案，前前後後搞了一個月，總算完成了。

本文將記錄我整個申請過程。不過請注意，即使你完全按著以下步驟做，我也不能保證你能順利申請成功。

此外，我還會講講如何用OpenWrt路由器讓你家中往ChatGPT等網站的流量自動走VPN。

## 支付方法

想繞過地域限制，當然要有一個外地的支付方式。我選擇在英國匯豐銀行開戶口，原因如下：

1. 申請英國匯豐戶口**沒有資產要求**
2. 無需外國地址證明
3. 申請過程免費

除英國匯豐外，我聽說[Wise](https://wise.com/)和[Revolut](https://www.revolut.com/)都是香港人可申請的支付方式，但我沒深入研究過，按下不表。

### 申請流程

{{< notice warning "要有香港匯豐銀行戶口" >}}
以下假設你已有香港匯豐銀行戶口，並已開通網上銀行服務。

如果沒有，雖然好像還是可以直接申請英國匯豐銀行戶口，但流程應該不一樣，本文亦不作說明。

{{< /notice >}}

先往[此網站](https://internationalservices.hsbc.com/zh-hk/services/ico/ntb/where-to-open/)，並回答問題：

1. `您是否持有滙豐戶口？`：是
2. `您現時所在地是？`：香港特別行政區
3. `您想在哪裡開立海外戶口？`：英國
4. `您是否將於7日內前往目的地？`：否

再按繼續，然後應出現`登入申請開戶`按鈕，按下即可前往申請頁面。

在申請頁面登入，然後按指示填寫個人資料，然後提交申請。

提交申請一日後，我就收到來自英國匯豐的電郵，內含我的英國戶口編號及銀行地址。不久後亦有匯豐銀行職員致電，用粵語向我解釋英國戶口的使用方式、條款等，亦要設定手機銀行登入密碼、安保問題等資料。（全程不需講英文！）

再等約兩星期，我就收到來自英國匯豐的信件，內有一張VISA扣帳卡。用這張扣帳卡就可以訂閱美國的AI/LLM服務了。

以下是一條申請英國匯豐戶口的教學影片，可作參考：

{{< youtube rUy6Le54BZE >}}

### 轉帳去英國匯豐戶口方法

我選擇用Interactive Broker（下稱*IB*）轉帳去英國匯豐戶口。

IB的外匯匯率**接近市價**，此外還可以每月免費出金一次。

如要從IB轉出英鎊至英國匯豐，要先做*簽名認證*。IB提供四種方法，其中最簡單的是攜帶香港身份證親身上IB辦公室辦理。我去了他們觀塘的辦公室，只花了約十分鐘就辦理完成。辦理後兩天我就可以出金至英國匯豐戶口了。

不過要注意的是IB本質是證劵商，如只用來做大額外幣兌換而不買賣股票的話，**有可能會被IB封禁**（網上討論區不難找到案例）。我自己本來就有用IB買賣股票，而且兌換英鎊的金額只佔我戶口總值的一小部分，所以才沒問題。

如果你沒有IB戶口的話，可以選擇直接用香港匯豐戶口網上轉帳：匯豐會在轉帳前自動將你的港幣兌換成英鎊。（當然匯率會比IB差一點）

## 外國手機號碼

我選擇英國Giffgaff電話卡。Giffgaff提供全球免費寄送SIM卡服務，而且養卡號簡單（就我理解每半年發一次短訊即可）。

你可以到[Giffgaff 官網](https://www.giffgaff.com/freesim-international)免費申請一張SIM卡。我申請過兩次，第一次申請後三星期都沒收到SIM卡，第二次申請後約兩星期才收到。

另外一個做法是去二手買賣平台（如Carousell）：有不少人願意免費寄送Giffgaff SIM卡（因為有回贈），你只需支付郵費即可於幾日內獲取SIM卡。我個人建議用這方法，因為比官方寄送快非常多。

獲得SIM卡後，你需要在Giffgaff官網激活它，然後**不選擇任何月費計劃**，選擇**Pay as you go**，然後增值（我用香港的VISA信用卡）。這樣你就可以用這個號碼接收手機驗證碼了。

{{< figure src="./Cards.jpg" caption="英國匯豐扣帳卡及Giffgaff SIM卡" >}}

## 訂閱AI/LLM服務

最後就是前往OpenAI/Claude網頁訂閱AI服務了。我用以上支付方法及電話號碼成功討閱OpenAI和Anthropic的Pro計劃，同時也能增值它們的API。

付費時的注意事項：

1. 你要全程啟動VPN
2. 要輸入正確的地址和郵政編碼（提示：去相應國家的*地產中介網頁* 找找看）

我測試過可以用非英國的VPN和地址。用英國地址的話要另外交VAT（即增值稅），建議用美國地址。

以下附上我訂閱證明：

{{< figure src="./ChatGPT_Plus.png" caption="ChatGPT Plus" >}}

\
{{< figure src="./OpenAI_API.png" caption="OpenAI API" >}}

\
{{< figure src="./Claude.png" caption="Claude" >}}

\
{{< figure src="./Claude_API.png" caption="Claude API" >}}

## OpenWrt

我自己有用OpenWrt軟路由：OpenWrt支持Policy-based Routing（下稱*PBR*），即根據條件決定流量走向（例如特定域名走VPN）。

透過PBR，我可以令我家中全部往ChatGPT的流量都走VPN，無需在手機/電腦特意安裝VPN程式，十分方便。

以下我將講講設定方法。

{{< notice note "手機行動網路設定方法" >}}
我[上一篇文章](../008_browser_level_vpn/#手機端做法)有講如何在使用行動網路時將特定網頁的流量走VPN，有興趣可以看看。

{{< /notice >}}

### 前置條件

{{< notice warning "注意" >}}
以下步驟只在OpenWrt 23.05版本測試過（但應同時適用於下一版本，即24.10）。
{{< /notice >}}

1. 你要有一部OpenWrt路由器

    先查找你家中路由器的型號，可能OpenWrt已經支持你的路由器，如支持就不需額外再買路由器。

    （請於這個[表格](https://openwrt.org/toh/views/toh_available_16128)中搜索）

    如要買新路由器，我推薦去淘寶買[GL-iNET GL-MT6000](https://detail.tmall.com/item.htm?id=743831055254)（約700人民幣），它是現時OpenWrt社群最推薦的路由器型號之一：有四核CPU和1GB RAM，有2.5Gbps網口及Wifi 6，而且安裝OpenWrt步驟很簡單，非常適合新手。

    你亦可以選擇買一部軟路由小電腦（例如淘寶上的N100小主機）安裝OpenWrt，再將現有的路由器設置為AP模式（或稱無線存取點模式）。軟路由機的性能通常較強，非常適合想深入研究OpenWrt的玩家。

2. 你要訂閱一個支持Wireguard的VPN

    就我所知，[Mullvad VPN](https://mullvad.net)、[AirVPN](https://airvpn.org/)、[ProtonVPN](https://protonvpn.com/)、[Surfshark](https://surfshark.com/)及[NordVPN](https://nordvpn.com/)都支持Wireguard。

    用Wireguard是因為它非常快（比OpenVPN快三倍有多！），而且PBR支持使用Wireguard。

3. 你的電腦要有SSH客戶端

    如使用Windows 10或11，可以用Windows內置SSH客戶端（[安裝方法](https://www.linode.com/docs/guides/connect-to-server-over-ssh-on-windows/#command-prompt-or-powershell---windows-10-or-11)），然後在Powershell內使用；

    又或可以用[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)，請自行研究使用方法。

### 下載Wireguard設定檔

{{< notice warning "注意" >}}
以下將以AirVPN做例。如你選擇用其他VPN，請自行研究獲取Wireguard設定檔之方法。

{{< /notice >}}

前往[AirVPN網站](https://airvpn.org/)，註冊一個帳戶，然後付款訂閱。

訂閱後，前往[Devices頁面](https://airvpn.org/devices/)按`Add a new Device`，然後替它改名（例如叫`OpenWrt`）：

{{< figure src="./AirVPN_Devices.png"  >}}

然後去[Config Generator頁](https://airvpn.org/generator/)：

1. `Choose your OS`：Router
2. `Choose protocols`：Wireguard
3. `Choose your device/connection`：你上一步創造的Device名
4. `Choose servers`：個人建議下方找`By countries`分類，然後選一個較近香港的國家（如日本/台灣/新加坡），以下用**日本**做例子
5. 最後於頁面最下方按`Generate`以下載Wireguard設定檔

{{< figure src="./Wireguard_Config.png" caption="Wireguard設定檔"  >}}

### 安裝OpenWrt

先安裝OpenWrt：不同型號路由器的安裝方法可能不同，請自己研究。

（可以在OpenWrt維基及論壇找安裝方法，例如[GL-iNET GL-MT6000](https://openwrt.org/toh/gl.inet/gl-mt6000)的頁面就有詳細步驟）

安裝後，找一部電腦用網線連接路由器，前往[192.168.1.1](https://192.168.1.1)進入OpenWrt介面：

{{< figure src="./OpenWrt.png" caption="OpenWrt介面" >}}

個人建議你先往`Network -> Wireless`設定Wifi（[官方教學](https://openwrt.org/docs/guide-quick-start/basic_wifi)）。

部分路由器（如GL-MT6000）支持*Hardware flow offloading*，啟動後可減少CPU負荷：前往`Network -> Firewall`按`Software flow offloading`，然後按`Hardware flow offloading`以啟動之。

### 安裝相關插件

於電腦執行SSH進入OpenWrt：

```bash
ssh root@192.168.1.1
```

然後執行以下指令：

```bash
# 安裝PBR及Wireguard
opkg update
opkg install luci-app-pbr luci-proto-wireguard resolveip ip-full

# 可選：安裝繁中翻譯，安裝後於System -> System -> Language and Style更改語言
opkg install luci-i18n-base-zh-tw

# 將dnsmasq替換為dnsmasq-full
# https://docs.openwrt.melmac.net/pbr/#Howtoinstalldnsmasq-full
opkg install libnettle8 libnetfilter-conntrack3
cd /tmp/ && opkg download dnsmasq-full
opkg remove dnsmasq
opkg install dnsmasq-full --cache /tmp/
rm -f /tmp/dnsmasq-full*.ipk

# 重啟OpenWrt
reboot
```

### 設定Wireguard

重啟後，再次前往[192.168.1.1](https://192.168.1.1)，進入`Network -> Interfaces`：

1. 於頁面左下方按`Add new interface...`
2. `Name`填任意值（如`pbr_airvpn`），`Protocol`選`Wireguard VPN`，再按`Create interface`
3. 於設定頁面最下方按`Load configuration...`，然後將先前下載的Wireguard設定檔內容複制貼上，再按`Import settings`
4. 如你用AirVPN，將`Advanced Settings`中的`MTU`值改成Wireguard設定檔內的`MTU`值（我的是1320）
5. 按`Save`，然後按`Save & Apply`

{{< figure src="./OpenWrt_Wireguard.png" caption="效果如圖" >}}

然後進入`Network -> Firewall`：

1. 左下角按`Add`
2. `Name`填任意值（如`pbr`），`Input`及`Forward`設為`reject`，`Output`設為`accept`
3. `Covered networks`加入你剛創造的Wireguard介面
4. 勾選`Masquerading`
5. `Allow forward from source zones:`加入`lan`
6. 按`Save`，然後按`Save & Apply`

{{< figure src="./OpenWrt_Firewall.png" caption="效果如圖" >}}

### 設定PBR

進入`Services -> Policy Routing`：

1. `Use resolver set support for domains`設定為`Dnsmasq nft set`
2. 於`Policies`左下方按`Add`
3. `Name`填任意值（如`AI`），然後`Remote addresses / domains`填以下：

```bash
anthropic.com claude.ai claudeusercontent.com servd-anthropic-website.b-cdn.net ai.com 
chatgpt.com chat.com oaistatic.com oaiusercontent.com openai.com openai.com.cdn.cloudflare.net 
openaiapi-site.azureedge.net openaicom-api-bdcpf8c6d2e9atf6.z01.azurefd.net 
openaicomproductionae4b.blob.core.windows.net production-openaicom-storage.azureedge.net sora.com
```

4. `Interface`選擇你的Wireguard介面
5. 按`Save`，然後按`Save & Apply`
6. 在頁面上方`Service Control`按`Enable`以設定為開機啟動，再按`Start`以啟動PBR

{{< figure src="./OpenWrt_PBR.png" caption="我的PBR設定" >}}

{{< notice info "原理" >}}
使用`Dnsmasq nft set`時（需要`dnsmasq-full`才能使用），PBR能夠將所有前往**指定域名及其所有子域名**的流量都走VPN。

例如在`Remote addresses / domains`加入`openai.com`時，所有前往`openai.com`及其所有子域名（如`api.openai.com`及`platform.openai.com`）的流量都會走VPN。

就我理解，pfSense/OPNsense這兩個防火牆系統不能做到覆蓋所有子域名，必須盡可能將所有子域名紀錄下來，非常麻煩；OpenWrt的PBR就方便得多了。

另外，上方的域名清單是從v2ray的Github抓來的：[v2fly: domain-list-community](https://github.com/v2fly/domain-list-community/tree/master/data)。如將來OpenAI/Anthropic有了新的域名，你只需將它手動加入PBR的域名清單，然後重啟PBR服務即可。

{{< /notice >}}

### 測試

開啟瀏覽器並前往[chatgpt.com](https://chatgpt.com)，如看到ChatGPT界面，則大功告成！

如果還是看到封鎖頁面，**請先清除電腦的DNS緩存**（這是[PBR已知問題](https://docs.openwrt.melmac.net/pbr/#footnote5)）。

Windows用家可開啟Powershell並執行以下指令：

```powershell
ipconfig /flushdns
```

請自行查找其他OS的清除電腦DNS緩存方法（通常重啟就可以了）。

清除DNS緩存後就可正常使用ChatGPT了。

## 有用連結

[OpenWrt PBR文檔](https://docs.openwrt.melmac.net/pbr/)
