+++
title = "用Wireguard做一個瀏覽特定域名才生效的VPN"
author = "Eric Leung"
description = "如何用Wireproxy及PAC檔設定一個在瀏覽特定域名（如chatgpt.com）時才生效的VPN"
date = "2024-08-18"
+++

{{< css "/css/chinese.css" >}}

{{< figure src="./Mullvad_Wireguard.png"  >}}

## 目錄

1. [序](#序)
2. [設定步驟](#設定步驟)
3. [手機端做法](#手機端做法)
4. [其他可行方案](#其他可行方案)

## 序

本文旨在講解如何用Wireguard設定一個瀏覽特定域名（如chatgpt.com）時才生效的VPN。

### 為甚麼？

我公司正開發一個使用OpenAI API的網頁程式。作為主要開發者，我一手包辦開發及測試環境設定、前端後端架構及開發。

因為OpenAI封禁了香港地區，我要用VPN去做開發。我選擇了[Mullvad VPN](https://mullvad.net)，原因如下：

1. Mullvad月費劃一為5歐元（約42港元），不像其他VPN公司般要買一年或以上才會便宜
2. Mullvad支持Wireguard（一個非常快的VPN協議），所以不用安裝他們的VPN程式，直接用Wireguard[官方程式](https://www.wireguard.com/install/)都可（不過其實Mullvad的[VPN程式](https://github.com/mullvad/mullvadvpn-app)也是開源的）
3. Mullvad以用戶私隱著稱，註冊甚至不需提供電郵，此外亦不會儲存任何用戶資料（[警察都找不到](https://www.theverge.com/2023/4/21/23692580/mullvad-vpn-raid-sweden-police)）

因為這OpenAI網頁程式屬試驗性質，上頭隨時都可能叫停開發，所以Mullvad的劃一月費便成為最大優勢。我也是這樣說服上司讓我用Mullvad的。

其實支持Wireguard又著重用戶私隱的VPN公司還有[AirVPN](https://airvpn.org/)和[ProtonVPN](https://protonvpn.com/)，不過它們的單月月費比Mullvad貴；主流的Surfshark和NordVPN都支持Wireguard（[Surfshark教學](https://support.surfshark.com/hc/en-us/articles/6586553044498-How-to-set-up-a-manual-WireGuard-connection-on-Windows)/[NordVPN非官方教學](https://gist.github.com/bluewalk/7b3db071c488c82c604baf76a42eaad3)）

~~公司出錢的話其實選哪個VPN都沒所謂，只是我想支持Mullvad，所以才選它:rofl:~~

### 問題

正常預設所有流量都會走VPN，這樣不但較慢，而且經常遇到因使用VPN才會有的Captcha測試，很麻煩。

Wireguard有一個`AllowedIPs`設定，可加入不同IP地址。Wireguard只會在連接這些指定IP時才生效，其他IP則不走Wireguard。

我想達成的是瀏覽chatgpt.com或openai.com時才經VPN上網，`AllowedIPs`功能有不足：其一，我不知道OpenAI所有子網域的IP；其二，無法排除OpenAI以後出現新IP或更改舊IP的可能性，我希望能一勞永逸。

如果有根據域名去決定用不用VPN的方法就好了:thinking:

### 解決方案：Wireproxy + Proxy Auto-Configuration（PAC）檔

經過一輪搜尋，我找到了解決方案：Wireproxy + Proxy Auto-Configuration（PAC）檔。

[Wireproxy](https://github.com/pufferffish/wireproxy)是一個開源的Wireguard客戶端，同時亦是一個SOCK5/HTTP代理伺服器。它會和Mullvad建立Wireguard連接，然後我再指定客戶端用它做網路代理，這樣就能經它用VPN。

[PAC檔](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file)（代理自動配置）則是一個Javascript檔。節錄MDN的介紹：

> 代理自动配置（PAC）文件是一个 JavaScript 脚本，其核心是一个 JavaScript 函数，用来决定网页浏览请求（HTTP、HTTPS，和 FTP）应当直连目标地址，还是被转发给一个网页代理服务器并通过代理连接。

將這兩個結合，就能做到瀏覽特定域名時才用VPN。

## 設定步驟

{{< figure src="./Cover.png" caption="效果圖" >}}

### 購買Mullvad VPN並下載Wireguard設定檔

前往[Mullvad網站](https://mullvad.net/zh-hant/account/create)產生一個帳號，然後購買VPN。

購買後，前往[Wireguard設定頁](https://mullvad.net/zh-hant/account/wireguard-config)：

1. 按`產生金鑰`
2. 在下方選擇你指定的國家/城市/伺服器
3. 按`產生組態並下載`下方的`下載檔案`以下載Wireguard設定檔

### 下載Wireproxy並執行

於此處下載[Wireproxy](https://github.com/pufferffish/wireproxy/releases/latest)並解壓縮。

把上一步下載的Wireguard設定檔放進Wireproxy同一文件夾，然後用文字編輯器打開，並於設定檔最後添加以下：

```ini
[Socks5]
# 端口25344，可自訂
BindAddress = 127.0.0.1:25344

[http]
# 端口25345，可自訂
BindAddress = 127.0.0.1:25345
```

更改後Wireguard設定檔應像這樣：

```ini
[Interface]
# Device: <不給你看>
PrivateKey = <不給你看>
Address = <不給你看>
DNS = <不給你看>

[Peer]
PublicKey = <不給你看>
AllowedIPs = 0.0.0.0/0,::0/0
Endpoint = <不給你看>
PersistentKeepalive = 25

[Socks5]
BindAddress = 127.0.0.1:25344

[http]
BindAddress = 127.0.0.1:25345
```

於Wireproxy所在文件夾開啟指令行（[Windows教學](https://superuser.com/a/1519563)），用以下指令啟動Wireproxy：

```bash
# Windows
wireproxy.exe -c <Wireguard設定檔名稱>

# Linux/MacOS
wireproxy -c <Wireguard設定檔名稱>
```

最後，在系統設定中設定代理伺服器為`http://127.0.0.1:25345`（[Windows教學（手動設定）](https://support.microsoft.com/zh-hk/windows/%E5%9C%A8-windows-%E4%B8%AD%E4%BD%BF%E7%94%A8-proxy-%E4%BC%BA%E6%9C%8D%E5%99%A8-03096c53-0554-4ffe-b6ab-8b1deee8dae1)/[MacOS教學](https://support.apple.com/zh-hk/guide/mac-help/mchlp2591/mac)），再試試能不能上<https://chatgpt.com>即可。

{{< notice warning "注意" >}}
其實我們只需要SOCKS5代理，不需HTTP代理。

不過我在測試Windows系統設定代理伺服器時，不知道為甚麼用SOCKS5時無法連接網絡，只能用HTTP。

PAC檔則沒有這個問題，所以測試HTTP代理成功後就可以將Wireguard設定檔中`[http]`一項刪除，然後重啟Wireproxy。

注意：HTTP及SOCKS5都是無加密，千萬不要在公共網絡上使用Wireproxy！

{{< /notice >}}

### 創造PAC檔

上一步讓我們成功透過Wireproxy瀏覽ChatGPT網站。問題是這是全域（Global）代理，全部流量都會經過它，這不是我想要的效果。

這時就到PAC檔出場了。創造一個`pac.js`檔案，並複製以下內容：

```javascript
function FindProxyForURL(url, host) {
  // 於此處自訂需要走Wireproxy的域名
  var domain_list = ["chatgpt.com", "openai.com", "claude.ai", "anthropic.com"];

  // 我不知道是不是所有OS都支援最新的Javascript格式，所以這裡用了最原始的Javascript寫法
  for (var i = 0; i < domain_list.length; i++) {
    if (host == domain_list[i] || dnsDomainIs(host, "." + domain_list[i])) {
      return "SOCKS5 127.0.0.1:25344";
    }
  }

  return "DIRECT";
}
```

以下是簡單解釋（PAC檔詳細文檔[請看此](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file)）：

1. `FindProxyForURL`

    `FindProxyForURL(url, host)`是一個Javascript函數，根據你指定條件決定流量走代理還是直連。我們想要的效果是特定網頁(OpenAI及Anthropic)走代理，其他全部直連。

    函數內的`url`和`host`分別代表「整個網址」和「域名」，例子：

    1. 網址是`https://platform.openai.com`：`url`為`https://platform.openai.com`，`host`為`platform.openai.com`
    2. 網址是`https://docs.anthropic.com/en/docs/welcome`：`url`為`https://docs.anthropic.com/en/docs/welcome`，`host`為`docs.anthropic.com`

2. `dnsDomainIs`

    `dnsDomainIs(host, domain)`函數則用來判定`host`是否屬於`domain`，如是則返回`true`，反之返回`false`。我覺得它只是一個簡單的子字串（Substring）檢查，例子：

    1. `dnsDomainIs("https://platform.openai.com", ".openai.com")`：返回`true`
    2. `dnsDomainIs("https://platform.openai.com", ".anthropic.com")`：返回`false`
    3. `dnsDomainIs("https://openai.com", ".openai.com")`：返回`false`（注意！）
    4. `dnsDomainIs("https://clopenai.com", "openai.com")`：返回`true`（注意！）

    第三/四點就是我說它純粹是子字串檢查的原因。為了解決第三點的同時又避免第四點的情況發生，我在判斷式中另外加了`host == <域名>`項。

3. 返回值（`return`）

    最後`return`一定要返回`DIRECT`（代表直連，不走代理）或格式為`<代理協議名> <代理地址>:<端口>`的字串。代理協議名可以是`PROXY`/`SOCKS`/`HTTP`/`HTTPS`/`SOCKS4`/`SOCKS5`，我們只用`SOCKS5`。

    你可以將不同代理用分號組合，例如`"SOCKS5 127.0.0.1:25344; HTTP 127.0.0.1:25345; DIRECT"`。系統會優先用最左的一項，如失敗才用下一個，如此類推。

請根據自己需要更改PAC檔。[PAC檔詳細文檔](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file)內有除`dnsDomainIs`以外的函數可供使用，例如有日期相關函數，可以用它們設定特定日子才走代理，本文不作解釋。

[延伸閱讀：PAC檔測試器](https://thorsen.pm/proxyforurl)

### 使PAC檔可經網絡存取

PAC檔必須可以經網絡存取（應該說我找不到讓系統直接讀取檔案系統內的PAC檔的方法）。

我想到有兩個做法：Python的HTTP server（最簡單）和Github（一勞永逸）。當然方法不只這兩個，例如你可以自己搭建一個Apache/NGINX伺服器。本文只討論Python和Github方法。

1. Python方法

    首先要[安裝Python](https://www.python.org/downloads/)，並確保Python在環境變數路徑（Path）上。

    然後在PAC檔所在文件夾內開啟指令行，並執行以下：

    ```bash
    # 127.0.0.1是地址，8000是端口，可自訂
    python -m http.server -b 127.0.0.1 8000
    ```

    用瀏覽器前往`http://127.0.0.1:8000/pac.js`，如看到PAC檔內容即成功。

    注意此方法在重開機/停止Python後便會失效，你要自己重新啟動它。

2. Github方法

    首先[安裝Git](https://git-scm.com/downloads)，並於Github註冊一個帳號。

    然後在Github[創造一個Repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository#creating-a-new-repository-from-the-web-ui)，名字隨意（以下假設Repo名為`pac`）。

    創造一個空白文件夾，將PAC檔移至此，並於文件夾內開啟指令行，執行以下：

    ```bash
    git init
    git add pac.js
    git commit -m "first commit"
    git branch -M main
    # 請手動更改下一項
    git remote add origin https://github.com/<你Github用戶名>/pac.git
    git push -u origin main
    ```

    最後用瀏覽器前往`https://raw.githubusercontent.com/<你Github用戶名>/pac/main/pac.js`，如看到PAC檔內容即成功。

### 電腦設定使用PAC檔

最後要在系統設定中設定使用PAC檔。如果你跟著我上方做法，那麼你的PAC檔網址應是：

1. `http://127.0.0.1:8000/pac.js`（Python方法）
2. `https://raw.githubusercontent.com/<你Github用戶名>/pac/main/pac.js`（Github方法）

這個設定每個OS的字眼都不同，Windows稱為「使用設定指令碼」，MacOS就稱「自動代理伺服器」，請按教學填上PAC檔網址即可。（[Windows教學（設定指令碼）](https://support.microsoft.com/zh-hk/windows/%E5%9C%A8-windows-%E4%B8%AD%E4%BD%BF%E7%94%A8-proxy-%E4%BC%BA%E6%9C%8D%E5%99%A8-03096c53-0554-4ffe-b6ab-8b1deee8dae1)/[MacOS教學](https://support.apple.com/zh-hk/guide/mac-help/mchlp2591/mac)）

最後驗證能登上<https://chatgpt.com>，而去<https://whatismyip.com>顯示的是你本地IP的話即大功告成。

### 雜項

Chromium基底的瀏覽器（如Chrome和Microsoft Edge）會用系統設定的代理。Firefox則不一定，如你用的是Firefox，可能要去Firefox設定頁手動設定代理（Firefox稱PAC網址為「Proxy自動設定網址」）。

VSCode作為Electron應用程序，同樣會用系統設定的代理；但VSCode內運行的程式卻不一定會走系統代理，例如OpenAI的Python庫所用的`httpx`則不走系統代理。

令OpenAI使用Wireproxy的方法如下：

```python
from openai import OpenAI
import httpx

client = OpenAI(
    api_key="<不給你看>",
    http_client=httpx.Client(proxy="socks5://127.0.0.1:25344"),
)

```

## 手機端做法

{{< figure src="./Mobile.png"  >}}

以上是電腦端的做法。手機想做到同樣效果比較麻煩，因為iOS和Android只有在連接Wifi的時候才能設定代理，使用流量時不能用代理，變相廢了一半武功。

不過我找到了代替品：Shadowrocket（iOS）和v2rayNG（Android）。

這兩個手機程式都是「翻牆工具」，但我們不是用它來翻牆，也不用搭建翻牆伺服器：我們只需要這些程式中的「按域名決定用VPN」功能。

注意：v2rayNG是免費，但Shadowrocket要付費（一次性2.99美元）。

### Android

於[此處](https://play.google.com/store/apps/details?id=com.v2ray.ang)下載v2rayNG。

下載後，準備好從Mullvad下載的Wireguard設定檔，然後開啟v2rayNG：

1. 添加配置文件（選`手動輸入[Wireguard]`）
2. 輸入以下，然後儲存：

   - 服務器地址：Wireguard設定檔的`Endpoint`（不包括端口）
   - 服務器端口：Wireguard設定檔的`Endpoint`的端口
   - SecretKey：Wireguard設定檔的`PrivateKey`
   - PublicKey：Wireguard設定檔的`PublicKey`
   - 本地地址：Wireguard設定檔的`Address`

3. 進入v2rayNG設定：

   - 域名策略：`AsIs`
   - 預定義規則：`全局直連`
   - 自定義規則：代理的網址或IP，輸入以下

      ```bash
      domain:openai.com,domain:chatgpt.com,domain:claude.ai,domain:anthropic.com
      ```

最後啟動v2rayNG（VPN），同樣去<https://chatgpt.com>和<https://whatismyip.com>驗證即可。

### iOS

於[此處](https://apps.apple.com/us/app/shadowrocket/id932747118)下載Shadowrocket。

下載後，準備好從Mullvad下載的Wireguard設定檔，然後開啟Shadowrocket：

（以下步驟建議接駁家中Wifi做）

1. 右上角新增伺服器，型別選擇Wireguard
2. 輸入以下，然後儲存：

   - 地址：Wireguard設定檔的`Endpoint`（不包括端口）
   - 埠：Wireguard設定檔的`Endpoint`的端口
   - 私鑰：Wireguard設定檔的`PrivateKey`
   - 公鑰：Wireguard設定檔的`PublicKey`
   - 子網IP：Wireguard設定檔的`Address`
   - DNS：Wireguard設定檔的`DNS`

3. 往「配置」頁，按`default.conf`，再按`編輯純文字`。這時會彈出一個界面，上方有一個網址

    （你可以選擇在手機界面繼續，但我建議你用電腦前往這網址，比較方便修改）

4. 修改`default.conf`：
   - 將`[Rule]`項中除了`# LAN`、`# Final`以外的項全部刪除
   - 將`# Final`項下方改成`FINAL,DIRECT`
   - 於`# LAN`上方加上以下內容：

      ```bash
      # AI
      DOMAIN-SUFFIX,openai.com,PROXY
      DOMAIN-SUFFIX,chatgpt.com,PROXY
      DOMAIN-SUFFIX,claude.ai,PROXY
      DOMAIN-SUFFIX,anthropic.com,PROXY
      ```

   - 將最下方的`[URL Rewrite]`項刪除
   - 按右上角`save`儲存

最後返回首頁並啟動Shadowrocket（VPN），同樣去<https://chatgpt.com>和<https://whatismyip.com>驗證即可。

## 其他可行方案

如果你家中的路由器是用OpenWrt或pfSense/OPNsense等OS的話，可以設定Policy-based routing。設定後，整個家庭網絡上的全部電腦都能做到特定網域走VPN。

以下是我找到的教學，但我沒實際測試過，不能保證其真確性，只作參考：

[OpenWrt：Don’t VPN Everything! - Split Tunnel Your Traffic - Policy Based Routing](https://youtu.be/FN2qfxNIs2g?t=214)

[OPNsense：WireGuard Selective Routing to External VPN Endpoint](https://docs.opnsense.org/manual/how-tos/wireguard-selective-routing.html)
