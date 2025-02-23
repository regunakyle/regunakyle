+++
title = "如何實現VFIO及Looking Glass（安裝篇）"
author = "Eric Leung"
description = "VFIO虛擬機及Looking Glass安裝教學"
categories = ["VFIO/Looking Glass系列"]
date = "2024-06-02"
+++

{{< css "/css/chinese.css" >}}

[按我返回上一篇文章](../006_simple_guide_for_vfio_1/)

（本文最後更新時間：2024年8月11日）

### VFIO虛擬機及Looking Glass設定

**本文假設你的電腦已經安裝最新版本的Fedora**（現時是40）。

我用的是[KDE版本](https://fedoraproject.org/spins/kde/download)，但本教學應同時適用於[GNOME版本](https://fedoraproject.org/workstation/)（即*Workstation* ）。注意**不要安裝不可變（Immutable）版本**（Fedora稱之為*Atomic Desktop* ），例如[Silverblue](https://fedoraproject.org/atomic-desktops/silverblue/)和[Kinoite](https://fedoraproject.org/atomic-desktops/kinoite/)。

強烈建議以下內容配合[Arch Wiki上的教學](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF)一並閱讀，可以相互參照。

我的設定可能和Arch Wiki上的有出入，因為我另外參考了[VFIO Discord](https://discord.com/invite/f63cXwH)內的Linux高手們較新的建議。我推薦加入這群組，因為群組內的`wiki-and-psa`頻道有必讀的虛擬機優化教學，此外也能請教群內Linux高手。

{{< notice warning "Intel用家注意" >}}

Intel平台上IOMMU需要以下步驟才能啟動：

1. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`intel_iommu=on`，然後儲存
2. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg`，然後重啟電腦
3. 重啟後執行[這節](../006_simple_guide_for_vfio_1/#%e4%b8%bb%e6%a9%9f%e6%9d%bfiommu)第4步檢查IOMMU組的腳本，如看到硬件的IOMMU組則成功

{{< /notice >}}

#### 綁定vfio-pci/pci-stub驅動程式

*vfio-pci* 是一個VFIO專用驅動程式。綁定*vfio-pci* 的硬件不會使用正常的驅動程式（比如顯示卡的官方驅動），因此宿主機不會使用這些硬件。這樣能保證**VFIO**虛擬機傳入硬件的穩定性。

在執行以下步驟前，先確保你**兩張顯示卡都已連接電腦螢幕**。綁定了*vfio-pci* 的顯示卡不會顯示宿主機的畫面。如果沒接駁第二張顯示卡，你就只會看到黑屏。（CPU內顯須用主機板後方面板上的HDMI/DP插口）

1. 執行[這節](../006_simple_guide_for_vfio_1/#%e4%b8%bb%e6%a9%9f%e6%9d%bfiommu)第4步檢查IOMMU組的腳本，記下你想傳入虛擬機的設備ID（應是`xxxx:xxxx`格式，例如我的3060 Ti的ID是`10de:2489`）
2. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`vfio_pci.ids=abcd:efgh,1234:5678`（請自行代入設備ID），然後儲存
3. 執行`sudo nano /etc/dracut.conf.d/vfio.conf`，貼上以下內容後儲存：

```bash
add_drivers+=" vfio vfio_iommu_type1 vfio_pci vfio_pci_core " 
force_drivers+=" vfio_pci "
```

4. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg` 及 `sudo dracut -fv`，然後重啟電腦
5. 重啟後輸入`lspci -nnk`，應看到想傳入虛擬機的設備有`Kernel driver in use: vfio-pci`。

有些硬件不能用以上方法綁定*vfio-pci* ，例如USB控制器和SATA控制器。因為這兩種硬件的驅動程式（USB是*xhci_hcd* 、SATA是*ahci* ）綁定優先度更高，*vfio-pci* 來不及綁定硬件。

這時候可以轉用*pci-stub* ：它是*vfio-pci* 的前身，功能和*vfio-pci* 相近，但綁定優先度比*xhci_hcd* 和*ahci* 更高。它的缺點是沒有*vfio-pci* 的一些功能（例如*vfio-pci* 可以把你的硬件設置成耗電較低的休眠狀態）。

1. 執行`sudo nano /etc/sysconfig/grub`，並於`GRUB_CMDLINE_LINUX`引號內的最後添加`pci-stub.ids=abcd:efgh,1234:5678`（請自行代入設備ID），然後儲存
2. 執行`sudo grub2-mkconfig -o /etc/grub2-efi.cfg`，然後重啟電腦
3. 重啟後輸入`lspci -nnk`，應看到想傳入虛擬機的設備有：`Kernel driver in use: pci-stub`。

不過也不一定要綁定*pci-stub* ：我自己就有一個USB控制器照常使用*xhci_hcd* ，**VFIO**虛擬機啟動時Linux會自動把*xhci_hcd* 換成*vfio-pci* ，虛擬機關機後又會換回*xhci_hcd* ，這樣做我沒遇到甚麼問題。

注意：我不知道SATA控制器（或其他*vfio-pci* 綁定不了的硬件）不綁定*pci-stub* 的話會不會有問題，這個要留給你自己研究了。

我的`GRUB_CMDLINE_LINUX`是這樣的：

```bash
GRUB_CMDLINE_LINUX="rhgb quiet vfio_pci.ids=10de:2489,10de:228b pci-stub.ids=1b21:3241"
```

#### 創建VFIO虛擬機

1. 執行`sudo dnf install -y @virtualization`
2. 下載[Windows 10 ISO檔](https://www.microsoft.com/zh-hk/software-download/windows10)及[此處下載](https://github.com/virtio-win/virtio-win-pkg-scripts?tab=readme-ov-file#downloads)的`Latest virtio-win ISO`，並將它們移至`/var/lib/libvirt/images`（提示：`sudo mv *.iso /var/lib/libvirt/images`）
3. 啟動*virt-manager*
4. 啟用設定：`Edit => Preferences => Enable XML editing`
5. 創建新的虛擬機（左上角按鍵）
6. 選擇安裝媒介
    - 如你想安裝Windows：
      1. 第一頁選擇`Local install media (ISO image or CDROM)`
      2. 第二頁選擇Windows 10 ISO檔作安裝ISO
    - 如你想使用已安裝Windows的儲存裝置，第一頁則選擇`Manual install`
7. 於`Choose the operation system you are installing`中選`Microsoft Windows 10`
8. 第三頁設定CPU及RAM
9. 第四頁取消勾選`Enable storage for this virtual machine`
10. 最後一頁勾選`Customize configuration before install`，然後按`Finish`

{{< figure src="./VirtManagerUI.png" caption="這時應出現這個介面" >}}

#### 設定VFIO虛擬機

[我的VFIO虛擬機的XML（參考用，不可直接複制貼上）](./vfio.xml)

1. 在`Overview`頁，`Chipset`選`Q35`，`Firmware`選`UEFI`

2. 在`CPU`頁，`Topology`下勾選`Manually set CPU Topology`：
    - `Sockets`設定為1
    - `Cores`設定為你想傳入的CPU核數
    - `Threads`設定為你CPU單核的線程數（如你的CPU支持[SMT](https://en.wikipedia.org/wiki/Simultaneous_multithreading)/[Hyper-threading](https://en.wikipedia.org/wiki/Hyper-threading)，此處應填**2**）

3. 按左下角`Add Hardware`，並加入以下內容：
    - 加入`PCI Host Device`：加入所有你想傳入虛擬機的硬件（例如*虛擬機卡* ）
    - 加入`Network`：`Device model`選擇`virtio`。加入後將原本使用`e1000e`的虛擬網卡刪除
    - 加入`Storage`：`Device type`選`CDROM Device`，再按`Manage...`並選擇上一部分第二步下載的`virtio-win`之ISO檔
    - 加入Windows存儲
      - 如果你選擇用虛擬硬碟：
          1. 加入`Storage`：設定虛擬硬碟容量，然後`Bus Type`選擇`SCSI`
          2. 加入`Controller`：`Type`選擇`SCSI`，`Model`選`VirtIO SCSI`
      - 如果你想將[Windows安裝於儲存裝置上](../006_simple_guide_for_vfio_1/#nvme-ssd及sata控制器)，加入`PCI Host Device`並選擇這儲存裝置的控制器

4. 最後返回`Overview`頁，然後按`XML`，進入下部分

##### CPU Pinning

此部分請配合[Arch Wiki上的條目](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#CPU_pinning)一并閱讀。

CPU Pinning可使虛擬機的CPU工作全部放在你指定的CPU線程上。沒有CPU Pinning的時候，Linux會把虛擬機的CPU工作隨意分配在不同CPU線程上，這可能導致虛擬機CPU性能較差或出現延遲。

開啟終端程式（如Konsole），輸入`lspcu -e`，應看到類似以下內容：

```bash
❯ lscpu -e
CPU NODE SOCKET CORE L1d:L1i:L2:L3 ONLINE    MAXMHZ    MINMHZ       MHZ
  0    0      0    0 0:0:0:0          yes 4950.1948 2200.0000 3600.0920
  1    0      0    1 1:1:1:0          yes 4950.1948 2200.0000 2197.2310
  2    0      0    2 2:2:2:0          yes 4950.1948 2200.0000 4884.6382
  3    0      0    3 3:3:3:0          yes 4950.1948 2200.0000 3823.2080
  4    0      0    4 4:4:4:0          yes 4950.1948 2200.0000 2200.0210
  5    0      0    5 5:5:5:0          yes 4950.1948 2200.0000 2194.9751
  6    0      0    6 8:8:8:1          yes 4950.1948 2200.0000 3487.3359
  7    0      0    7 9:9:9:1          yes 4950.1948 2200.0000 3814.7109
  8    0      0    8 10:10:10:1       yes 4950.1948 2200.0000 2646.6521
  9    0      0    9 11:11:11:1       yes 4950.1948 2200.0000 3786.4270
 10    0      0   10 12:12:12:1       yes 4950.1948 2200.0000 2725.9070
 11    0      0   11 13:13:13:1       yes 4950.1948 2200.0000 4775.0581
 12    0      0    0 0:0:0:0          yes 4950.1948 2200.0000 2615.2581
 13    0      0    1 1:1:1:0          yes 4950.1948 2200.0000 3854.8860
 14    0      0    2 2:2:2:0          yes 4950.1948 2200.0000 2200.0000
 15    0      0    3 3:3:3:0          yes 4950.1948 2200.0000 2637.1350
 16    0      0    4 4:4:4:0          yes 4950.1948 2200.0000 2198.7981
 17    0      0    5 5:5:5:0          yes 4950.1948 2200.0000 3593.8911
 18    0      0    6 8:8:8:1          yes 4950.1948 2200.0000 2200.0000
 19    0      0    7 9:9:9:1          yes 4950.1948 2200.0000 3347.8350
 20    0      0    8 10:10:10:1       yes 4950.1948 2200.0000 2200.0000
 21    0      0    9 11:11:11:1       yes 4950.1948 2200.0000 3814.2129
 22    0      0   10 12:12:12:1       yes 4950.1948 2200.0000 2199.4971
 23    0      0   11 13:13:13:1       yes 4950.1948 2200.0000 4768.5542
```

`CPU`一欄其實是線程（Thread），`CORE`一欄是這線程實際所屬的CPU核。我們要將屬同一個`CORE`的全部`CPU`做Pinning，以保證最高效能。

此外，`L1d:L1i:L2:L3`一欄最後的數字（即`L3`快取）也值得注意：Arch Wiki建議Pin`L3`組別相同的`CPU`。如果你和我一樣有兩個或以上的`L3`組別，我建議先Pin同一組別的全部`CPU`，性能不夠的話再去Pin其他組別的`CPU`。

在`<vcpu>`項下方添加`<cputune>`內容。下方是我的設定（我Pin了20個`CPU`）：

```xml
<cputune>
    <vcpupin vcpu="0" cpuset="6" />
    <vcpupin vcpu="1" cpuset="18" />
    <vcpupin vcpu="2" cpuset="7" />
    <vcpupin vcpu="3" cpuset="19" />
    <vcpupin vcpu="4" cpuset="8" />
    <vcpupin vcpu="5" cpuset="20" />
    <vcpupin vcpu="6" cpuset="9" />
    <vcpupin vcpu="7" cpuset="21" />
    <vcpupin vcpu="8" cpuset="10" />
    <vcpupin vcpu="9" cpuset="22" />
    <vcpupin vcpu="10" cpuset="11" />
    <vcpupin vcpu="11" cpuset="23" />
    <vcpupin vcpu="12" cpuset="2" />
    <vcpupin vcpu="13" cpuset="14" />
    <vcpupin vcpu="14" cpuset="3" />
    <vcpupin vcpu="15" cpuset="15" />
    <vcpupin vcpu="16" cpuset="4" />
    <vcpupin vcpu="17" cpuset="16" />
    <vcpupin vcpu="18" cpuset="5" />
    <vcpupin vcpu="19" cpuset="17" />
    <emulatorpin cpuset="0-1,12-13" />
</cputune>
```

上方`<vcpupin>`內的`vcpu`是虛擬機的CPU次序，由0開始，按次序遞增即可。`cpuset`則對應你`lspcu -e`列出的`CPU`一欄的數字（即線程），同`CORE`的全部`CPU`最好連續在一起。

`<emulatorpin>`則是將宿主機處理虛擬工作的CPU工作放在指定的`CPU`內。我建議將全部未Pin的`CPU`都加進這項的`cpuset`內。

注意`<vcpupin>`要避免Pin第0個`CORE`的`CPU`。

CPU Pinning不是把指定CPU線程限制只能由虛擬機使用：它只是把虛擬機的CPU工作全部指派給你指定的CPU線程去做，宿主機仍能使用這些Pin了的CPU線程。

（有方法把CPU線程完全獨立出來供虛擬機使用，可看看[Arch Wiki](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Dynamically_isolating_CPUs)的說明）

{{< notice warning "Intel 大小核 CPU 用家注意" >}}
我自己沒用過大小核結構的Intel CPU，不過我看過網上的討論，很多都建議只用（除`CORE` 0外的）P-core做`vcpupin`，E-core則只做`emulatorpin`及`iothreadpin`。

如果`vcpupin`混合了P-core和E-core的話可能會產生問題，具體請自己研究。

{{< /notice >}}

##### IOThread

{{< notice error "注意" >}}
**這部分只適用於虛擬硬碟用家**。如你選擇直接安裝Windows於儲存裝置上，請[跳過本節](#其他雜項優化)！
{{< /notice >}}
此部分請配合[Arch Wiki上的條目](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Virtio_disk)一并閱讀。

設定IOThread可提高虛擬硬碟的讀寫性能：

1. 在介面左方按`Controller VirtIO SCSI`，在`<controller>`內加`<driver>`，添加後應如此：

    ```xml
    <controller type="scsi" model="virtio-scsi">
        <!--注：queues的值請設為虛擬機總線程數-->
        <driver iothread='1' queues='20'/>
    </controller>
    ```

2. 返回`Overview`頁，在`<vcpu>`下方添加`<iothreads>1</iothreads>`
3. 於`<cputune>`內的`<emulatorpin>`下添加`<iothreadpin>`：

    ```XML
    <iothreadpin iothread="1" cpuset="0-1,12-13" />
    ```

    （請自己代入`cpuset`的值，其應和`<emulatorpin>`的`cpuset`的值一樣）

##### 其他雜項優化

- **如果你用AMD的CPU**，請在`<cpu>`項內加`<feature policy='require' name='topoext'/>`及`<cache mode='passthrough'/>`。添加後應如此：

```xml
<cpu mode="host-passthrough">
    <topology sockets="1" cores="10" threads="2"/>
    <feature policy="require" name="topoext"/>
    <cache mode="passthrough"/>
</cpu>
```

- 將`<features>`項內的`<hyperv>`項替換做以下內容（[Hyper-V Enlightenments](https://www.qemu.org/docs/master/system/i386/hyperv.html)）：

```xml
    <hyperv mode='custom'>
        <relaxed state='on'/>
        <vapic state='on'/>
        <spinlocks state='on' retries='8191'/>
        <vpindex state='on'/>
        <runtime state='on'/>
        <synic state='on'/>
        <stimer state="on"/>
        <vendor_id state='on' value='randomid'/>
        <frequencies state='on'/>
        <tlbflush state='on'/>
        <ipi state='on'/>
    </hyperv>
    <kvm>
        <hidden state="on"/>
    </kvm>
```

- 將`<clock>`項替換做以下內容：

```xml
<clock offset="localtime">
    <timer name="rtc" tickpolicy="catchup"/>
    <timer name="pit" tickpolicy="delay"/>
    <timer name="hpet" present="no"/>
    <timer name="hypervclock" present="yes"/>
</clock>
```

### 安裝Windows

按左上方`Begin Installation`，然後照常安裝Windows。

如果你選擇用虛擬硬碟，Windows因為沒驅動程式，所以不能將它辨認出來：

{{< figure src="./Windows_SCSI_1.png" >}}

這時按`Load driver`，再於出現的驅動程式中選擇`w10`一項即可：

{{< figure src="./Windows_SCSI_2.png" caption="要有`virtio-win`作為CDROM，Windows才能找到驅動程式" >}}

因為Windows沒有`virtio`虛擬網卡的驅動，所以整個安裝過程都是離線進行。

安裝Windows後，開啟檔案總管（File Explorer）並開啟`virtio-win`的CDROM，然後執行CDROM內的`virtio-win-gt-x64.msi`。安裝成功後應可連接至網絡。

最後將**VFIO**虛擬機關機，然後開啟虛擬機設定介面：

1. 將兩個CDROM刪除
2. 開啟XML並尋找`<memballoon>`一項，將`type`設定為`none`

到此**VFIO**虛擬機安裝已完成。如果你不打算安裝**Looking Glass**，可直接[跳過下一部分](#雜項)。

純**VFIO**應該還有其他設定要做（例如[設定evdev](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Passing_keyboard/mouse_via_Evdev)和[ddcutil](https://www.ddcutil.com/)快速切換螢幕輸出），請自己做功課，在此不作說明。

### Looking Glass設定

本部分請配合[Looking Glass官方安裝文檔（B7-rc1）](https://looking-glass.io/docs/B7-rc1/install_libvirt/)一并閱讀。

官方文檔簡潔易明（至少比**VFIO**的教學更容易理解），所以我只提供較簡要的教學。一切以官方教學為準。

1. 官方教學之[Install Libvirt](https://looking-glass.io/docs/B7-rc1/install_libvirt/)：
    - 根據[Determining memory](https://looking-glass.io/docs/B7-rc1/install_libvirt/#determining-memory)一節去計算所需RAM量並記下
    - 根據以下部分內容修改虛擬機XML：
        1. [Keyboard/mouse/display/audio](https://looking-glass.io/docs/B7-rc1/install_libvirt/#keyboard-mouse-display-audio)
        2. [Clipboard synchronization](https://looking-glass.io/docs/B7-rc1/install_libvirt/#clipboard-synchronization)（如XML中已有文檔提及的部分，則可跳過此步）

2. 安裝[編譯依賴](https://looking-glass.io/wiki/Installation_on_other_distributions#Fedora_35.2B)：

    ```bash
    sudo dnf install -y \
        cmake gcc gcc-c++ libglvnd-devel fontconfig-devel spice-protocol make nettle-devel \
        pkgconf-pkg-config binutils-devel libXi-devel libXinerama-devel libXcursor-devel \
        libXpresent-devel libxkbcommon-x11-devel wayland-devel wayland-protocols-devel \
        libXScrnSaver-devel libXrandr-devel dejavu-sans-mono-fonts \
        libdecor-devel pipewire-devel libsamplerate-devel git
    ```

3. 官方教學之[Building](https://looking-glass.io/docs/B7-rc1/build/):
    - 找一個空白文件夾，入內開啟終端程式並用Git下載**Looking Glass**源代碼（下稱*LG文件夾* ）：

        ```bash
        git clone --recurse-submodules https://github.com/gnif/LookingGlass.git
        ```

    - 於*LG文件夾* 內的`client`文件夾內創建`build`文件夾並入內開啟終端程式
    - 執行以下指令：

        ```bash
        cmake -DENABLE_WAYLAND=1 -DENABLE_X11=0 -DENABLE_PULSEAUDIO=0 -DENABLE_PIPEWIRE=1 ../
        make
        sudo make install
        ```

{{< notice error "注意" >}}
如果你的*宿主機卡* 是NVIDIA，而又選擇用官方閉源的驅動程式的話，可能用不了KVMFR module。

可以試試照常執行下方步驟。但如果行不通，請改用[IVSHMEM with standard shared memory](https://looking-glass.io/docs/B7-rc1/ivshmem_shm/)。

用這方法的話，[請跳過下方步驟](#雜項)，並根據官方教學自行安裝。(這方法應比安裝KVMFR簡單一點)

（用開源的驅動程式的話應可用KVMFR module）
{{< /notice >}}

4. 官方教學之[IVSHMEM with the KVMFR module](https://looking-glass.io/docs/B7-rc1/ivshmem_kvmfr/)：

    - 安裝[編譯依賴](https://looking-glass.io/wiki/Installation_on_other_distributions#Installing_Additional_Dependencies_for_Kernel_Module_Build)：

        ```bash
        sudo dnf install -y dkms kernel-devel kernel-headers
        ```

    - 於*LG文件夾* 內的`module`文件夾內開啟終端程式
    - 執行`sudo dkms install "."`以安裝
    - 執行`sudo nano /etc/modprobe.d/kvmfr.conf`並輸入以下內容，然後儲存：

        ```bash
        options kvmfr static_size_mb=32
        ```

        （將`32`改成第一步計算出的數字）

    - 執行`sudo nano /etc/modules-load.d/kvmfr.conf`並輸入以下內容，然後儲存：

        ```bash
        # KVMFR Looking Glass module
        kvmfr
        ```

    - 執行`sudo nano /etc/udev/rules.d/99-kvmfr.rules`並輸入以下內容，然後儲存：

        ```bash
        SUBSYSTEM=="kvmfr", OWNER="user", GROUP="kvm", MODE="0660"
        ```

        （將`user`改成你的Linux用戶名；可執行`whoami`指令以查看）

    - 修改虛擬機XML：
        1. 將最上方的`<domain>`改成：

            ```xml
            <domain xmlns:qemu="http://libvirt.org/schemas/domain/qemu/1.0" type="kvm">
            ```

            **（修改後先別儲存）**

        2. 於XML最後（即`</domain>`前）添加以下內容：

            ```xml
            <qemu:commandline>
                <qemu:arg value='-device'/>
                <qemu:arg value='{"driver":"ivshmem-plain","id":"shmem0","memdev":"looking-glass"}'/>
                <qemu:arg value='-object'/>
                <qemu:arg value='{"qom-type":"memory-backend-file","id":"looking-glass","mem-path":"/dev/kvmfr0","size":33554432,"share":true}'/>
            </qemu:commandline>
            ```

            （將`33554432`改成第一步計算出的數字，再乘以1024的二次方）

    - 執行`sudo nano /etc/libvirt/qemu.conf`：
        1. 找出`cgroup_device_acl`項（nano內按`CTRL+W`可搜索關鍵字）
        2. 將整個部分取消註解，並於最後添加`/dev/kvmfr0`，然後儲存。應得出以下：

            ```bash
            cgroup_device_acl = [
                "/dev/null", "/dev/full", "/dev/zero",
                "/dev/random", "/dev/urandom",
                "/dev/ptmx", "/dev/kvm",
                "/dev/userfaultfd",
                "/dev/kvmfr0"
            ]
            ```

5. SELinux容許QEMU使用`kvmfr0`：
    - 創造一個空白文件夾，入內並創造`kvmfr.te`檔案，修改內容如下：

        ```bash
        module kvmfr 1.0;

        require {
            type svirt_t;
            type device_t;
            class chr_file { map open read write };
        }

        #============= svirt_t ==============
        allow svirt_t device_t:chr_file { map open read write };
        ```

    - 於文件夾開啟終端程式，執行以下指令：

        ```bash
        checkmodule -M -m -o kvmfr.mod kvmfr.te
        semodule_package -o kvmfr.pp -m kvmfr.mod
        sudo semodule -i kvmfr.pp
        ```

    - 重啟電腦

6. 啟動**VFIO**虛擬機：
    - 如果*virt-manager* 顯示虛擬機黑屏，請先把螢幕輸出轉至*虛擬機卡* 插螢幕的插口，再繼續操作
    - 於[此處](https://looking-glass.io/downloads)下載**Bleeding Edge**的*Windows Host Binary* 並安裝
    - 於[此處](https://www.spice-space.org/download.html#windows-binaries)下載*spice-guest-tools* 並安裝（安裝後虛擬機和宿主機可共享剪貼簿）
    - 確保**Looking Glass**服務正在運行：
        1. 於虛擬機內按`WIN+R`，輸入`services.msc`並執行
        2. 找出`Looking Glass (host)`
        3. 如其未開始運行，選擇它，然後滑鼠右鍵功能表按啟動

7. 於宿主機上開啟終端程式：
    - 執行`nano $HOME/.looking-glass-client.ini`並輸入以下內容，然後儲存：

        ```ini
        [app]
        shmFile=/dev/kvmfr0

        ; 禁止Windows使用你的麥克風；或可設做`allow`並容許Windows使用你的麥克風
        ; 如不設這項，每次Windows要用麥克風的時候，Looking Glass都會彈出對話框問你是否同意使用
        [audio]
        micDefault=deny
        ```

        （可於[此處](https://looking-glass.io/docs/B7-rc1/usage/#all-command-line-options)查看所有設定項）

    - 執行`looking-glass-client`，如能看到虛擬機畫面及操作它，則大功告成

{{< notice info "Looking Glass 客戶端使用教學" >}}

在Looking Glass窗口內按住*Escape key*（預設是`ScrollLock`鍵）可看到快捷鍵一覽。例如：

1. `ScrollLock`：切換*Capture mode* ：*Capture mode* 下滑鼠及鍵盤會被鎖定在Looking Glass內
2. `ScrollLock+F`：切換全螢幕模式
3. `ScrollLock+D`：開啟或關閉FPS展示器

可以在`.looking-glass-client.ini`設定*Escape key* ，例如：

```ini
; 設鍵盤右邊的alt鍵為Escape key
[input]
escapeKey=KEY_RIGHTALT
```

執行`looking-glass-client input:escapeKey=help`以查看可設做*Escape key* 的所有鍵。

[Looking Glass客戶端官方使用教學](https://looking-glass.io/docs/B7-rc1/usage/)

{{< /notice >}}

8. **（可選）** Looking Glass OBS插件

    **Looking Glass**有個OBS插件可讓你將整個虛擬機的畫面投射到OBS上。

    安裝很簡單（[官方OBS插件安裝教學](https://looking-glass.io/docs/B7-rc1/obs/)）：

    1. 安裝OBS；例如安裝[Flatpak版](https://flathub.org/apps/com.obsproject.Studio)：

        ```bash
        flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
        flatpak install -y flathub com.obsproject.Studio
        ```

    2. 安裝編譯依賴：`sudo dnf install obs-studio-devel`
    3. 於*LG文件夾* 內的`obs`文件夾內創建`build`文件夾並入內開啟終端程式
    4. 執行以下指令：

        ```bash
        cmake -DUSER_INSTALL=1 ../
        make
        ```

    5. 安裝插件：
        - Flatpak版OBS：執行以下指令

            ```bash
            FLATPAK_OBS_PLUGIN_DIR="$HOME/.var/app/com.obsproject.Studio/config/obs-studio/plugins/looking-glass-obs/bin/64bit"
            mkdir -p "$FLATPAK_OBS_PLUGIN_DIR"
            cp liblooking-glass-obs.so "$FLATPAK_OBS_PLUGIN_DIR"
            ```

        - Fedora版OBS：執行`make install`
    6. 啟動OBS，於`Sources`加入`Looking Glass Client`
        - `SHM File`填`/dev/kvmfr0`
        - 勾選`Use DMABUF import (requires kvmfr device)`

{{< figure src="./OBS.jpg" caption="效果圖" >}}

### 雜項

#### 繞過虛擬機偵測

在虛擬機XML中的`<os>`項內添加`<smbios mode="host" />`項，可以繞過部分遊戲的虛擬機偵測（例如[Elden Ring](https://store.steampowered.com/agecheck/app/1245620/)和[VRChat](https://store.steampowered.com/app/438100/VRChat/)）。

因為我不怎玩線上遊戲，所以沒有深入研究過反制虛擬機偵測方法。如果只是偶爾玩玩，可以另外[買個SSD，並把VFIO虛擬機直接安裝在上面](../006_simple_guide_for_vfio_1/#nvme-ssd及sata控制器)，想玩線上遊戲時再Dual boot即可。

如選擇Dual boot，建議先添加上方`<smbios>`項，然後將虛擬機的UUID值修改成主機板的UUID值，否則Dual boot後可能要重新認證Windows：

1. 執行`sudo dmidecode -s system-uuid`並記錄所得的UUID值
2. 找一個空白文件夾，入內開啟終端程式
3. 執行`sudo virsh dumpxml vfio-win10 > vfio.xml`
4. 開啟`vfio.xml`，將`<uuid>`的值改成第一步獲得的UUID值
5. 執行以下指令：

```bash
sudo virsh undefine --keep-nvram vfio-win10
sudo virsh define vfio.xml
```

（將第3及第5步的`vfio-win10`改成你VFIO虛擬機的名稱）

#### 經網絡連接虛擬機

正常情況下虛擬機會在虛擬網絡內。虛擬機可經網絡連接外界，但宿主機及宿主機網絡上其他電腦卻不能經網絡連接虛擬機。

如果想經網絡連接虛擬機的話，有兩個方法：

{{< underline "橋接網絡 (Network Bridge)" >}}

注意：此方法要求宿主機以有線乙太網絡連接上網。如果你只能用WiFi，請轉用端口轉發方法（[原因](https://superuser.com/questions/1847193/why-can-ethernet-nics-bridge-to-virtualbox-and-most-wi-fi-nics-dont)）

1. 開啟終端程式並執行`nmcli con`，記下你有線乙太網絡的名稱（例如`eth0`或`enp1s0`等）
2. 執行以下指令：

```bash
nmcli con add type bridge autoconnect yes con-name br0 ifname br0 stp no
# 以DHCP方式連接br0
# 如有需要，可改成`ipv4.method manual`並手動設定（請自行Google設定方法）
nmcli con modify br0 ipv4.method auto
# 將下兩行的eth0改成你的有線乙太網絡的名稱
nmcli con del eth0
nmcli con add type bridge-slave autoconnect yes con-name eth0 ifname eth0 master br0
```

3. 重啟電腦
4. 開啟**VFIO**虛擬機設定介面並選擇虛擬機的虛擬網卡
5. `Network source`選`Bridge device...`，`Device name`填`br0`

最後啟動**VFIO**虛擬機並查找它的IP，應看到IP是在宿主機的同一子網路內。

{{< underline "端口轉發 (Port Forwarding)" >}}

1. 找一個空白文件夾，入內開啟終端程式
2. 執行`git clone https://github.com/saschpe/libvirt-hook-qemu.git`
3. 根據[說明](https://github.com/saschpe/libvirt-hook-qemu/blob/master/hooks.json)自行修改`hooks.json`。可於[hooks.schema.json](https://github.com/saschpe/libvirt-hook-qemu/blob/master/hooks.schema.json)查看`hooks.json`的格式
4. 執行`sudo make install`
5. 於Linux設定中開啟網絡設定，並選擇正在使用的網絡連接
6. 於`General configuration`中之`Firewall zone`選擇`FedoraWorkstation`，以容許網絡上其他電腦連接宿主機的1025至65535端口

安裝後，可透過宿主機的指定端口去連接虛擬機的指定端口。

#### 更新Looking Glass

如果**Looking Glass**使用正常，那麼不需要特意去更新它。

但遇到問題時，可試試更新**Looking Glass**，步驟如下：

1. 於*LG文件夾* 內開啟終端程式
2. 更新源代碼：

    ```bash
    git pull --recurse-submodules
    ```

3. 進入`client`內的`build`文件夾，執行以下指令：

    ```bash
    cmake -DENABLE_WAYLAND=1 -DENABLE_X11=0 -DENABLE_PULSEAUDIO=0 -DENABLE_PIPEWIRE=1 ../
    make
    sudo make install
    ```

4. 如使用KVMFR，進入`module`文件夾：

   - 執行`dkms status`並記下顯示的`kvmfr/<版本數字>`
   - 執行`sudo dkms remove kvmfr/<版本數字> --all`
   - 再次執行`dkms status`
   - 如仍有*kvmfr* 項，執行`sudo rm -rf /var/lib/dkms/kvmfr`
   - 執行`sudo dkms install "."`

5. 啟動**VFIO**虛擬機，於[此處](https://looking-glass.io/downloads)下載**Bleeding Edge**的*Windows Host Binary* 並安裝

6. 如安裝了OBS插件，進入`obs`內的`build`文件夾，執行以下指令：

    ```bash
    cmake -DUSER_INSTALL=1 ../
    make

    # 以下二選一以安裝OBS插件
    # Flatpak版OBS：
    FLATPAK_OBS_PLUGIN_DIR="$HOME/.var/app/com.obsproject.Studio/config/obs-studio/plugins/looking-glass-obs/bin/64bit"
    mkdir -p "$FLATPAK_OBS_PLUGIN_DIR"
    cp liblooking-glass-obs.so "$FLATPAK_OBS_PLUGIN_DIR"

    # Fedora版OBS：
    make install
    ```

#### 降低虛擬機卡耗電

[VFIO Discord](https://discord.com/invite/f63cXwH)的大神發現*虛擬機卡* 單靠*vfio-pci* 的內建休眠功能不能真正達致低耗電，需要綁定官方驅動程式才能做到低耗電。

你可以選擇常時啟動**VFIO**虛擬機以綁定官方驅動程式，但這樣做可能會佔用很多資源（例如佔用大量RAM）。

另一個做法是創造一個低資源虛擬機並傳入*虛擬機卡* ，並於**VFIO**虛擬機關機時啟動它。我的做法：

1. 下載[Debian](https://www.debian.org/)安裝檔並將其移至`/var/lib/libvirt/images`
2. 開啟終端程式並執行`sudo systemctl enable libvirtd`
3. 創造Debian虛擬機：

   - 提供極少資源（我只提供單核/兩線程和512MB RAM）
   - 傳入**VFIO**虛擬機使用的*虛擬機卡*
   - 於`Boot Options`勾選`Start virtual machine on host boot up`
   - 不安裝任何桌面環境

4. 安裝後，在啟動時的Grub畫面中按`UEFI Firmware Settings`，然後將`Device Manager`=>`Secure Boot Configuration`=>`Attempt Secure Boot`取消掉，然後按幾次`ESC`返回首頁，再按`Reset`
5. 在這虛擬機上安裝*虛擬機卡* 的官方驅動程式（[Debian安裝NVIDIA驅動教學](https://wiki.debian.org/NvidiaGraphicsDrivers)），然後重啟虛擬機
6. 執行`nvidia-smi`，如看到顯示卡資訊則成功

這樣做不但可以降低耗電，你還可以在這虛擬機內做顯示卡相關的工作（例如跑AI）。

缺點是麻煩：你想玩遊戲時要將它關機（否則不能啟動**VFIO**虛擬機），**VFIO**虛擬機關機後又要手動啟動它。

因此，我特意寫了一個[程式](https://github.com/regunakyle/vfio-vm-rotation-service)將這步驟自動化。安裝教學如下：

1. 找一個空白文件夾，入內開啟終端程式
2. 執行`sudo dnf install libvirt-devel make gcc`
3. 執行`git clone https://github.com/regunakyle/vfio-vm-rotation-service.git`
4. 開啟`vfio-vm-rotation.service`並於`[Service]`下方加入以下內容：

    ```bash
    # 請於下方代入虛擬機名稱
    Environment="VFIO_VM_NAME=VFIO虛擬機名"
    Environment="IDLE_VM_NAME=低資源虛擬機名"
    ```

5. 執行`sudo make install`

安裝後，你只需將低資源虛擬機關機，VFIO虛擬機就會自動啟動，反之亦然。

[VFIO Discord](https://discord.com/invite/f63cXwH)內有進一步降低耗電的教學，請自行研究，在此不作說明。

### 結語

以上就是**VFIO**及**Looking Glass**的安裝教學。希望能幫助對**VFIO**有興趣的朋友。

最後附上我重裝Linux時特意去跑的3DMark分數：

{{< figure src="./BareMetal.jpg" caption="實機Windows下的3DMark跑分" >}}

\
{{< figure src="./Cover.jpg" caption="Looking Glass B7-rc1下的跑分（比實機少兩核/四線程）：可看到顯示卡性能損耗比B6少" >}}
