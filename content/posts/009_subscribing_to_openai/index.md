+++
title = "如何不靠淘寶在香港訂閱ChatGPT/Claude"
author = "Eric Leung"
description = "無需淘寶，無需sms-activate"
date = "2099-11-27"
+++

{{< css "/css/chinese.css" >}}

{{< figure src="./Cover.png"  >}}

## 前言

相信大家都知道在中美貿易戰背景下，OpenAI及其他美國AI/LLM相關的服務不對中國及香港用戶開放。

現時香港人若想訂閱ChatGPT Plus，就要先解決以下問題：

1. 支付方式
2. 外國電話號碼
3. 地域IP封鎖

就我理解，以上問題的對應主流解決辦法是：

1. 在淘寶或其他網店付費代充值OpenAI
2. 使用 [sms-activate](https://sms-activate.guru/)或類似服務接收OpenAI的驗證碼
3. 使用付費VPN繞過地域封鎖

(1)及(2)雖簡單直接，但我個人不喜歡使用這種第三方服務，畢竟控制權並非完全在自己手中。於是我花了點時間研究其他解決方案，前前後後搞了一個月，總算完成了。

本文將記錄我整個申請過程。不過請注意，即使你完全按著以下步驟做，我也不能保證你能順利申請成功。

此外，我還會講講如何用OpenWrt路由器讓你家中往ChatGPT等網站的流量自動走VPN。

## 支付方法

想繞過地域限制，當然要有一個外地的支付方式。我選擇在英國匯豐銀行開戶口，原因如下：

1. 申請英國匯豐戶口**沒有資產要求**
2. 無需外國地址證明
3. 申請過程免費

除英國匯豐外，我聽說Wise和Revolut都是香港人可申請的支付方式，但我沒深入研究過，按下不表。

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

再等約兩星期，我就收到來自英國匯豐的信件，內有一張VISA扣帳卡。用這張扣帳卡就可以在OpenAI付款了。

以下是一條申請英國匯豐戶口的教學影片，可作參考：

{{< youtube rUy6Le54BZE >}}

### 轉帳去英國匯豐戶口方法

我選擇用Interactive Broker（下稱IB）轉帳去英國匯豐戶口。IB的外匯匯率**接近市價**，此外還可以每月免費出金一次。

不過要注意的是IB本質是證劵商，如只用來做外幣兌換而不買賣股票的話，有可能會被IB封禁。我自己本來就有用IB買賣股票，而且兌換英鎊的金額只佔我戶口總值的一小部分，所以才沒問題。

如果你沒有IB戶口的話，可以選擇直接用香港匯豐戶口網上轉帳：匯豐會在轉帳前自動將你的港幣兌換成英鎊。當然匯率會比IB差一點。

## 外國手機號碼

我選擇英國Giffgaff電話卡。Giffgaff提供全球免費寄送SIM卡服務，而且養卡號簡單（就我理解每半年發一次短訊即可）。

你可以到[Giffgaff 官網](https://www.giffgaff.com/freesim-international)免費申請一張SIM卡。我申請過兩次，第一次申請後三星期都沒收到SIM卡，第二次申請後約兩星期才收到。

另外一個做法是去二手買賣平台（如Carousell）。有不少人願意免費寄送Giffgaff SIM卡（因為可以收到回贈），你只需支付郵費即可於幾日內獲取SIM卡。我個人建議用這方法，因為比官方寄送快非常多。

獲得SIM卡後，你需要在Giffgaff官網激活它，然後**不選擇任何月費計劃**，選擇Pay as you go的付款方式，然後增值（我用香港的VISA信用卡）。這樣你就可以用這個號碼接收SMS了。

{{< figure src="./Cards.jpg" caption="英國匯豐扣帳卡及Giffgaff SIM卡" >}}

{{< notice info "大功告成" >}}
去到這一步，你已經可以不靠淘寶和sms-activate就能自己訂閱ChatGPT Plus了。你使用任意VPN就能訂閱及使用外國的AI服務。

如果你對OpenWrt設定不感興趣，可直接跳過下一部分。
{{< /notice >}}

## OpenWrt

我自己有用OpenWrt軟路由：OpenWrt支持Policy-based Routing（下稱PBR），即根據條件決定流量走向（例如特定域名走VPN）。

透過PBR，我可以令我家中全部往chatgpt.com的流量都走VPN，不需要每一部手機都安裝VPN程式，十分方便。

以下我將講講設定方法。

{{< notice note "手機行動網路設定方法" >}}
我[上一篇文章](../008_browser_level_vpn/#手機端做法)有講如何在使用行動網路時將特定網頁的流量走VPN，其他流量照常走行動網路。

有興趣可以看看。

{{< /notice >}}

### 前置條件

1. 你要有一部OpenWrt路由器

    GL MT6000，N100/J4125 mini PC

2. 你要訂閱一個支持Wireguard的VPN

    Mullvad/AirVPN/ProtonVPN/Surfshark/NordVPN

### 安裝OpenWrt插件

dnsmasq-full/luci-app-pbr/luci-proto-wireguard, reboot

### 設定Wireguard

Generate Japan VPN config file, create a Wireguard interface

### 設定PBR

ai.com chat.com chatgpt.com oaistatic.com oaiusercontent.com openai.com openai.com.cdn.cloudflare.net anthropic.com claude.ai claudeusercontent.com niconico.jp

Note: Flush DNS cache

## 結語

- You may think it is unnecessary to do all these things, "just use taobao"
- Feels nice to control all the components in the whole chain, this is geek style.
