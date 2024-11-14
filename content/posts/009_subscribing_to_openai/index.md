+++
title = "如何在香港訂閱ChatGPT"
author = "Eric Leung"
description = "無需淘寶，無需sms-activate"
date = "2099-11-04"
+++

{{< css "/css/chinese.css" >}}

TODO: Image: HSBC + IBKR + OpenWrt + Giffgaff + Wireguard

## 前言

相信大家都知道在中美貿易戰背景下，OpenAI及其他美國AI/LLM相關的服務不對中國及香港用戶開放。

現時香港人若想訂閱OpenAI，就要先解決以下問題：

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

申請成功後，英國匯豐會寄一張VISA扣帳卡到你府上，你用這張卡就可以在OpenAI上付費了。

### 申請流程

{{< notice warning "要有香港匯豐銀行戶口" >}}
以下假設你已有香港匯豐銀行戶口，並已開通網上銀行服務。

如果沒有，雖然好像可以直接申請英國匯豐銀行戶口，但流程應該不一樣，本文亦不作說明。

{{< /notice >}}

先往[此網站](https://internationalservices.hsbc.com/zh-hk/services/ico/ntb/where-to-open/)

提交申請後約一星期，我就收到來自英國匯豐的電郵，內含我的英國戶口編號及銀行地址。

1. HSBC staff will call you and explain details (in Chinese)
2. Debit card will be send to you in weeks time
3. Transfer GBP to this account, I use IBKR (best forex pricing, no wiring fee, free withdrawal once per month)
4. Pay with the debit card when subscribing to openai

## 外國手機號碼

我選擇英國Giffgaff電話卡。Giffgaff提供全球免費寄送Sim卡服務，而且養卡號簡單（就我理解每半年發一次短訊即可）。

你可以到[Giffgaff 官網](https://www.giffgaff.com/freesim-international)免費申請一張Sim卡。我申請過兩次，第一次申請後三星期都沒收到Sim卡，第二次申請後約兩星期才收到。另外一個做法是去二手買賣平台（如Carousell）買一張二手的Giffgaff Sim卡，這樣可以省下等待時間。

獲得Sim卡後，你需要激活它，然後選擇Pay as you go的付款方式。這樣你就可以用這個號碼接收SMS了。

Go to giffgaff and ask for a free sim.
The sim card will be send to you in weeks time.
Activate the sim card, then choose pay as you go options.
Use this number to receive SMS.

## VPN

- If you are lazy, just buy a popular VPN service and use it, done.
- I use OpenWrt at home so I want to share the VPN with my family.
- OpenWrt can handle this: we can combine wireguard and policy-based routing.

The following assume you already have a OpenWrt router. If not, I recommend buying one from Taobao (e.g. GL MT6000)

1. Subscribe a VPN service that support Wireguard (e.g. NordVPN, Surfshark, Mullvad, AirVPN), I picked AirVPN
2. Install packages
3. Generate VPN config file, create a Wireguard interface
4. Setup policy based routing

<https://www.youtube.com/watch?v=FN2qfxNIs2g&t=90s>

## 結語

- You may think it is unnecessary to do all these things, "just use taobao"
- Feels nice to control all the components in the whole chain, this is geek style.
