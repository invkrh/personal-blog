---
title: ElemenaryOS Installation Guide
---

This is a guide on how to install ELemenaryOS in UEFI mode.

### Why UEFI mode ?
UEFI is largely used for PCs pre-installed window 8, 10. Most of the PCs after 2010 have UEFI. And then, some of  Linux distros offer pure UEFI image file and reinforce the UEFI compatibility.

UEFI comes up with the **secure boot** which makes sure the OS booted is the one certificated. Sometimes it is not very friendly with some distros. Consider disable it.

### Prepare image USB
1. [Download ElemenaryOS image file](https://elementary.io/)
2.  [Create the install drive](https://elementary.io/docs/installation)

### Prepare PC
1.  Enter the firmware (BIOS) by press one of the following button: `F2`, `F12`, `ESC`, etc.
2.  Disable secure boot (and fast boot, if win8 is preinstalled)
3.  Reorder boot sequence: USB > HDD
4.  Make sure your PC can be reboot, not matter in Legacy mode or in UEFI mode

### Install EOS
1.  Insert USB drive
2.  On boot options menu, choose USB drive with **UEFI** label, which will boot your iso file in UEFI mode and it guarantee that the installation will be also in UEFI mode
3.  After booting the image, a list about EOS will be displayed. I recommend choosing `Try Elementary without Installation` since you can still launch the installation.
4.  Access to the image system and click the last icon on the docker to install the real system on your PC. A lot of useful tools, like `GParted`, `gdisk` are installed in the image. You can take advantage of that.
5.  The first several steps are trivial. Let's take a break when need to choose the way we install EOS:
  - Install EOS alongside the existing OS
  - Erase disk and install EOS
  - Something else (recommended)

    > The first two options are trivial, it will do the job for you. The next step is for the third option which needs to partition your HDD manually.

6. In most of the time, you only need:
  - `/boot`
  - `/` (root)
  - `/home`
  - `swap`

    Since you want to boot in UEFI mode, you have to leave a specify partition for EFI boot which can be found in the file system type drop down list. The partition is also called **ESP** (EFI System Partition). Make sure ESP is the first partition on the disk.

    Let's take a concrete example:
    Give an SSD disk of 256G, then the partition could be (pay attention to ESP's position)

    No. Disk|Mount Point|FS type|size|
    ---|---|---|---
    `/dev/sda1`|`/boot/efi`|EFI boot|512M
    `/dev/sda2`|`/boot`|ext4|2G
    `/dev/sda3`|`/root`|ext4|50G
    `/dev/sda5`|`/home`|ext4|All the rest
    None|`swap`|swap|8G

    **Some remarks:**

    * `/boot/efi` will be created by default
    * sda1-4 are reserved for the maximum 4 **primary** partitions. All the other `sdaX` stands for **logical** partitions in the **extended** partition
    * Here, we have 3 primary partitions, 1 extended partition, and 1 logical partition.

### Reboot in UEFI mode
Now you can reboot your PC. But remember to boot in UEFI mode. You can set that option in BIOS. Some PCs need to select a config file for UEFI manually. Normally, you can find it in `EFI/ubuntu/shimx64.efi`. Finally, save and quit.

### Enjoy
