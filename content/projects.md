+++
title = "My Projects"
author = "Eric Leung"
description = "Introducing my side projects"
date = "2025-05-24"
+++

## Completed

### [LIHKG Gwent Guide](https://regunakyle.github.io/lihkg-gwent-guide/)

A guide for [GWENT: The Witcher Card Game](https://www.playgwent.com/) written with [Hugo](https://gohugo.io/).

It has 1,000 visitors per month at it's peak. Unfortunately the game is [effectively discontinued](https://www.ign.com/articles/cd-projekt-red-is-sunsetting-support-for-gwent-the-witcher-card-game).

It is a fun game, and demands strategic planning rather than luck. I recommend you to try it.

### [My Discord Bot](https://github.com/regunakyle/my-discord-bot)

A Discord bot written in Python using [Discord.py](https://discordpy.readthedocs.io/en/stable/). Docker version available [here](https://hub.docker.com/r/regunakyle/my-discord-bot).

It can send you notification about free game giveaways and also play Youtube music in voice chats.

It is also a LLM chat client: currently users can interact with my self-hosted Qwen2.5-Coder instance with the Discord bot.

## In Development

### LIRC Web

A simple webapp that controls an existing [LIRC](https://www.lirc.org/) service.

Features include:

- Blast infrared signals on demand
- Perform scheduled infrared blasting
- Import/Export LIRC configuration files

### Android Hant-to-Hans Translation Context Menu

A simple Android app that add an button in the context menu that shows up when highlighting a piece of text.

When triggered, the app replace all Traditional Chinese characters with their Simplified Chinese variant (one-to-one mapping).

This is actually a built-in feature of iOS. So far I am unable to find an equivalent in the Android ecosystem, so I am going to write it myself.

### Realtime AI Chat Web

A simple webapp that allow users to chat with an AI in voice. Requires TTS, STT and a generic LLM chat model.

Motivated by the urge to prank my friends with a voice-activated AI.

### Nexus Mods Downloader

A webapp and a browser extension that allow user to queue mod downloads remotely.

Downloading big mods without premium subscription can be very slow. Host this app in a 24/7 running machine and you can go sleep while the mods are downloading.
