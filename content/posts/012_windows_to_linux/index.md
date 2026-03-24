+++
title = "從今天開始轉用Linux：Fedora安裝教學"
author = "Eric Leung"
description = ""
isCJKLanguage = true
date = "2099-07-27"
+++

{{< css "/css/chinese.css" >}}

## 前言

- Apple Silicon Macs also can use Linux, but not covered in this article

## Linux適合我嗎？

- List out most used software, including games and productivity apps
- protondb, areweanticheatyet
- Discord streaming does not function well (OBS works though)
- Most anti-cheat game cannot be played, but some can
- Use Linux to force yourself to learn things, Linux main server OS in the world, IMO Windows user generally use powershell over WSL
- Also free of privacy-invading features of Windows, no auto reboots
- Programming in Linux is better in Windows, Docker requires no VM, Linux package install is easy
- You can install Linux on another hdd/ssd. Article does not cover how to install Linux on the same disk as Windows
- Must have: Heart to tinker, ability to google, because WILL hit roadblocks

## 選擇Distro及DE

- Ubuntu/Fedora
- Suggest Fedora, do not use immutable variant
- Good: Up to date software (even better than arch), relatively stable, corporate backing, almost work OOTB
- Bad: Need install propietary drivers, SELinux, Guides might not cover Fedora (but most can be solved by a programmer without issue)
- GNOME/KDE, suggest use KDE
- Alternative: Use Arch, Linux Mint, but not covered in this article
- Test your choice in VM

## Fedora安裝教學

- Download Fedora everything image and burn to USB
- Plug USB to PC, load BIOS, run USB
- Install OS, unpick all options except browser (not really useful software)
- Install Flathub, explain flatpak benefit (close to upstream), and what should not be installed as flatpak
- RPMFusion, driver for GPU, propietary codec
- Network firewall setup

## Alternative to common software in Windows/ Useful software

Setup script url

- fcitx5 (no word select)
- google chrome
- kate
- steam
- strawberry
- KDE Connect
- fastfetch
- asdf (and plugins)
- zsh
- meld
- @virtualization
- vscode
- kolourpaint
- okular
- libreoffice
- thunderbird (davmail)
- remmina
- solaar
- distrobox
- waydroid

## 結語

- Linux is most suited for programmers, but is also suitable for people who just watch videos and light gaming
- Try out VFIO if you need Windows, but it will not be easy (it is very rewarding though, but I wouldn't suggest it to everyone)
