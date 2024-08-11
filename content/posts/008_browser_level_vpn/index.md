+++
title = "用Wireguard設定Browser-level VPN"
author = "Eric Leung"
description = "Setting up browser level VPN with Wireguard and Mullvad"
date = "2099-07-30"
+++

{{< css "/css/chinese.css" >}}

{{< figure src="./Cover.png"  >}}

## 序

本文旨在講解如何用Wireguard設定Browser-level VPN。

## 為甚麼？

我公司正開發一個使用OpenAI API的網頁程式。作為主要開發者，我一手包辦開發及測試環境設定、前端後端架構及開發。

因為OpenAI封禁了香港地區，我要用VPN去做開發。用VPN的問題是

<https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file>

<https://my.loginet.ee/index.php?/knowledgebase/article/20/how-to-configure-a-proxy-server-on-an-iphone-or-ipad/>.
