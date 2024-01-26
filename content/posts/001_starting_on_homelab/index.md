+++
title = "Starting on Homelab"
author = "Eric Leung"
description = "Documenting my homelab journey"
date = "2023-04-05"
+++

My journey of homelabbing started on July 2021.

I just finished writing my [Discord bot](https://github.com/regunakyle/my-discord-bot/) prototype and was looking for a place to host it. I first looked for free cloud services.
As my knowledge of cloud was really limited at that time, I gave up and went for real hardware instead. (I would use Oracle Cloud now if I were to choose one, they provide an always-free tier)

I was about to buy a Raspberry Pi 4B, the price was (and still is) outrageous, but I couldn't find of a better alternative. Then the sysadmin in my company heard about this and gave me a mini PC for free (Thanks, Andrew:ok_man:).

{{< figure src="./PiPO.jpg" caption="PiPO X7" >}}

The mini PC was really lacking: it has a very weak Intel Atom CPU, 2GB of DDR3L RAM and 32bit EFI firmware (incompatible with most Linux distros). I was lucky to find a [Linux installation guide](https://isaacs.pw/2020/06/installing-linux-lubuntu-20-04-lts-onto-a-pipo-x7-mini-pc-intel-z3736f/) for this particular model, and after a week of tinkering I managed to install a modified Ubuntu Server on it.
I put my Discord bot scripts on it and ran it for a month without issue.

I learnt more about self-hosting during that time. Things like [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome), [Jellyfin](https://github.com/jellyfin/jellyfin) and [Scanservjs](https://github.com/sbs20/scanservjs) particularly piqued my interest. However, the mini PC was not capable of handling all these services. I had to look for better hardware, so I turned to our sysadmin again for recommendation. This time I bought a Synology NAS.

{{< figure src="./Synology.jpg" caption="Synology DS220+ (with 16GB of extra RAM)" >}}

The Synology NAS is much more capable than the mini PC.
Its OS (DiskStation Manager) is really user-friendly, they did a excellent job of abstracting complex networking infrastructure away from users. Given the relative popularity of Synology, it's easy to find guides online.
If I were to recommend a prebuilt server to a new homelab practitioner, Synology would be my number one choice.

Running softwares directly in the Synology NAS is generally not feasible because of various compatibility issues (missing dependencies, outdated kernel, etc.). Luckily my DS220+ supports Docker, which is great because almost all the self-hostable services package their software as Docker images.
I spent some time reading Docker documentations and experimenting, learning a lot in the process. I even managed to package my Discord bot into a [Docker image](https://hub.docker.com/r/regunakyle/my-discord-bot). Before I knew it, I had a bunch of containerized services running on the NAS.

{{< figure src="./Portainer.png" caption="My hosted services" >}}

But why stops here? The Synology NAS was struggling to meet my growing ambition. This time I turned to my brother's old PC, it was about 7 years old and needed an upgrade anyway.
So I bought him some *shiny new hardware™* :money_with_wings: and used his old PC to build my own NAS. He was happy, I was happy, a win-win for both of us!

{{< figure src="./Server.jpg" caption="Self built NAS" >}}

The homelab scales, so does my need for complex networking infrastructure. I don't expose my network to the public, but for some services it is unavoidable (e.g. [Umami](https://github.com/umami-software/umami), [Synapse](https://github.com/matrix-org/synapse)). Following the old wisdom of network isolation, I bought some used enterprise networking gears and designed my network topology. Ideally only one isolated Debian VM is exposed to the public, it cannot touch other machines in my network (except some services like database). I can only access the other machines via VPN outside my home network.

This is where I am stuck right now, as I have limited knowledge on setting up a network. But I am working on it! My ultimate goal is to replace online services with self-hosted alternatives, as many as I can.  :factory_worker:
