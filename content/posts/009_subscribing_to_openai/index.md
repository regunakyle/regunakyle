+++
title = "（無需淘寶）我如何在香港訂閱OpenAI"
author = "Eric Leung"
description = ""
date = "2099-07-27"
+++

{{< css "/css/chinese.css" >}}

Image: HSBC + IBKR + OpenWrt + Giffgaff + Wireguard

## 前言

China and USA sanctions.
Currently buying OpenAI/Claude in HK has three issues:

1. Payment method
2. Mobile number for registration
3. GeoIP block

You can resolve (1) with Taobao, (2) with services like sms-activate. This blog shows you how to solve the first two issues without either of these. Then I use OpenWrt to do policy based routing.

## 支付方法

HSBC UK, debit card (VISA)

1. Requires a HSBC HK account, but have no asset requirement AFAIK
2. Completely free
3. apply at <https://internationalservices.hsbc.com/zh-hk/services/ico/ntb/where-to-open/>
4. HSBC staff will call you and explain details (in Chinese)
5. Debit card will be send to you in weeks time
6. Transfer GBP to this account, I use IBKR (best forex pricing, no wiring fee, free withdrawal once per month)
7. Pay with the debit card when subscribing to openai

## 外國手機號碼

Go to giffgaff and ask for a free sim.
The sim card will be send to you in weeks time.
Activate the sim card, then choose pay as you go options.
Use this number to receive SMS.

PS: I plan to use USB GSM modem to manage the sim card in Home Assitant, the modem can be bought in Taobao, though the setup is not covered here

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
