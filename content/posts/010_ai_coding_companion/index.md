+++
title = "AI與編程：如何打造自己的AI編程助手"
author = "Eric Leung"
description = "講講"
isCJKLanguage = true
date = "2099-01-31"
+++

{{< css "/css/chinese.css" >}}

## 歷史回顧

相信大家對AI/LLM都不陌生，我自己亦不例外：事實上，我可能屬於香港最早接觸ChatGPT的一批人。

記得當時OpenAI還沒有成熟的地域封鎖（不用VPN也能上到網站，同時可以註冊帳號，但用不了ChatGPT），不過當時只是單純覺得挺有趣，沒有深入研究。

半年過去，ChatGPT/GPT-4打起了名堂，成為了全球熱話。與此同時，Meta發佈了自己的LLM：LLaMA（*Large Language Model Meta AI* ）。Meta要求用戶填表才能下載LLaMA，但有好事之人[直接將BitTorrent連結放上LLaMA的Github上](https://github.com/meta-llama/llama/pull/73)，令人捧腹大笑的同時更是開創了Self-host LLM的熱潮。

[llama.cpp](https://github.com/ggerganov/llama.cpp)的推出使Self-hosted LLaMA的熱潮爆發，幾乎每一星期就有一個基於LLaMA的新模型推出。作為Self-host愛好者，我馬上緊跟LLaMA的新聞，也試過自行編譯`llama.cpp`去運行LLM。

當時熱情過頭，於是去二手市場買了一張3090，然後試玩了[text-generation-webui](https://github.com/oobabooga/text-generation-webui)。但由於沒有更好的Frontend工具，所以將3090放置成為了[Sunshine](https://app.lizardbyte.dev/Sunshine/)雲端遊戲伺服器。直至後來[Continue](https://www.continue.dev/)和[tabbyAPI](https://github.com/theroyallab/tabbyAPI)推出後，我才重新開始用GPU跑LLM，現在每天使用這些工具確實提升了我的生產力。

## 為甚麼要Self-host LLM？用付費LLM服務不是更方便嗎？

老實說，我相信有95%人都不需要自己在家運行LLM。

我能想到Self-host LLM的原因有以下：

1. 你對Self-host有熱誠/想學習（這是我的原因）
2. 你希望用一個沒有自我審查的模型 ([例子](https://www.reddit.com/r/LocalLLaMA/comments/149su0a/a_short_conversation_with_falcon/))
3. 你需要機密資料作查詢，同時又不信任第三方AI服務安全性

如果你選擇用第三方LLM服務（即OpenAI/Claude/Deepseek/OpenRouter等），你可直接跳去本文討論[Frontend](#frontend)項：我所提及的工具全部都可以選擇用第三方LLM服務，不一定要用Self-hosted LLM。

## 正文

在開始之前，先定義組成AI編程助手的三個部分：**Model（模型）**、**Backend（後端）**、**Frontend（前端）**。

**Model（模型）** 是LLM本身，通常由一個或多個超大型檔案組成，例如有`*.gguf`和`*.safetensors`格式。通常可以

**Backend（後端）** 則是運行Model的軟件。這些軟件通常有API接口；主流Backend的API接口都是與OpenAI相通，你只需使用OpenAI官方開發者套件就能使用這些API。

**Frontend（前端）** 則是使用Backend的API去

有些軟件同時擔任多於一個角色：例如text-generation-webui就是Backend + Frontend

<https://github.com/ollama/ollama/issues/5800>
<https://github.com/turboderp-org/exllamav3>

### Model

For coding, can be categorized into (at least) 4 kinds of model: chat model, autocomplete model, embedding model, reranking model

Qwen2.5-Coder

quantization format example: gguf, gptq, awq, exl2
Notably, pick gguf if your vram is insufficent, otherwise pick one of the other three
pick Q4 at least, exl2 maybe pick 4.0bpw at least, otherwise quality deteriorate very quickly

Deepseek R1 is not suited for autocomplete

embedding model pick nomic-embed-text

i dont self host reranking model as it is slow, so cannot give a proper opinion

hint: where to find quantized model (huggingface)

### Backend

Ollama
vLLM
tabbyAPI
huggingface-tei

all have openai compatible endpoint. Notably all of these support Windows. (This guide will cover Linux setup only, but it shouldn't deviate much, i think)

Ollama is a wrapper of llama.cpp, **all its model is gguf**. If your GPU can fit your whole model in VRAM, do not use ollama!

spectulative decoding, (roughly speaking) using a smaller model to predict output of greater model, improve speed of output at the expense of VRAM usage
ollama no support spectulative decoding(link), but llama.cpp itself supports it

### Frontend

Continue
Cline
avante.nvim
SillyTavern

This part focus on continue.dev. It is relatively mature, support code generation/editing, code autocomplete, auto context selection. support vscode and jetbrains product

## 我的AI伺服器

[Specs here](https://pcpartpicker.com/list/qHCQKX) (Note: The case is Formd T1)

also act as a cloud gaming server with sunshine.

Runs RHEL 9 with libvirt VM. You can pick any other distro with libvirt support.

Notably, proxmox does not support libvirt: You can choose Proxmox if you dont need to make a cloud gaming server (libvirt is easier to setup VFIO optimizations).

or just run windows or

The AI VM runs debian 12.

setup nvidia driver, git, huggingface-cli, docker

git clone tabbyapi, run install script, set as systemd service `start.sh` on boot

after running docker compose, run `docker exec...` to tell ollama to run nomic embed text
docker compose example

```yaml
services:
  ollama:
    volumes:
    # Create a `data` folder in where you run `sudo docker compose up -d`
      - ./data:/root/.ollama
    ports:
      - 11434:11434
    container_name: ollama
    image: ollama/ollama
    restart: unless-stopped

networks:
  default:
    name: ollama-network
```

<https://mistral.ai/news/codestral-2501/>
subset of my vscode config

```json
  "allowAnonymousTelemetry": false,
  "models": [
    {
      "title": "qwen2.5-coder 32b instruct",
      "provider": "openai",
      "model": "Qwen_Qwen2.5-Coder-32B-Instruct-exl2",
      "apiBase": "http://192.168.1.51:11434/v1"
    }
  ],
  "tabAutocompleteModel": [
    {
      "title": "qwen2.5-coder 32b instruct",
      "provider": "openai",
      "model": "Qwen_Qwen2.5-Coder-32B-Instruct-exl2",
      "apiBase": "http://192.168.1.51:11434/v1"
    }
  ],
  // // Very slow, disable if needed
  // "reranker": {
  //   "name": "huggingface-tei",
  //   "params": {
  //     "apiBase": "http://192.168.1.51:8080",
  //     "truncate": true,
  //     "truncation_direction": "Right"
  //   }
  // },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text",
    "apiBase": "http://192.168.1.51:11435"
  },
  "tabAutocompleteOptions": {
    "maxPromptTokens": 2048,
    "debounceDelay": 500
  },
```

## 結語

希望以上內容幫助到你。

最後講講最近非常熱門的Deepseek R1模型：

我認為競爭是好的

Meta釋出LLaMA時，即使當時這公司的名聲不佳，我仍為它喝彩，

## 其他有用連結

<https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview>

<https://newsletter.pragmaticengineer.com/p/ai-tools-for-software-engineers-simon-willison>
