+++
title="Kernel 101 - Writing your first bootloader!"
description="This post talks about writing an x86 bootloader and running it with an emulator"
author="Nagesh Podilapu"
draft=true
date="2022-09-27"
[taxonomies]
tags=["bootloader", "kernel", "assembly"]
+++

I just wanted to write a kernel for learning some really low level operating system concepts. And in that journey I figured out a lot of things, and writing a bootloader is one of those. I choose to use x86 CPU architecture, so when I say CPU it means an x86 CPU.

# Where does it all start?

When a computer starts up, the job of getting from nothing to a functional operating system involves a lot of steps. When you power on your computer with a CPU, it will expect the first instruction to execute to be at physical address **0xFFFFFFF0**. This physical address is also called [reset vector](https://en.wikipedia.org/wiki/Reset_vector). So the x86 CPU vendors will hardcode Instruction Pointer(EIP) to **0xFFFFFFF0**.

All you need to do is to place your BIOS program's first instruction at reset vector, so that CPU can load BIOS. Almost all the CPU's comes with a BIOS program stored in a ROM inside motherboard at the reset vector address, but we sure can write our own BIOS (a bit of PITA) and write it to memory at reset vector. If something goes wrong while writing your BIOS to memory, you will end up having a bricked CPU!

First BIOS will copy itself from the ROM it is residing to RAM for faster access and this process is called [shadowing](http://www.rigacci.org/docs/biblio/online/firmware/shadow.htm). I don't want to go that deep (maybe next time I'll try writing a BIOS), this time I thought of taking an existing basic BIOS and writing our own bootloader and giving it to BIOS.

# What is a bootloader?

Bootloader is a piece of code which start the operating system by loading it to the disk memory of a computer from a bootable medium and passing control to the kernel (core of Operating system).

# How does BIOS executes our bootloader?

Few basics before the answer, A sector is a part of a memory device. One sector is **512 bytes** in most of the hard disks that we use (newer HDDs use 4096 bytes as a sector as well), and If you want to use a disk as a bootable medium then the first sector should contain bootloader.

Back to answer, once BIOS is loaded it will search for bootable devices, but How?

Any disk with last 2 bytes of boot sector(i.e 511th, 512th bytes) having the sequence **0xAA55** is assumed to be a bootable disk and that sequence is called boot signature. Otherwise BIOS won't consider the disk for booting.

Once it identifies a bootable disk then it copies first 512 bytes to memory address **0x007C00** and transfers control to this address by a jump instruction to processor.

Typically the job of a bootloader is to load operating system residing somewhere else on the disk, since bootsector is only 512 bytes it might not be able to load a complex operating system by itself. Instead it loads another bootloader somewhere on the disk and pass the job of loading operating system, this is called [Chain-Loading](https://en.wikipedia.org/wiki/Chain_loading). Right now, we don't concern ourselves with all this (Do we!), our goal is to write a bootloader which executes and prints the famous 'Hello World!'.

A thing to note here is that we will be operating in [real mode](https://en.wikipedia.org/wiki/Real_mode) of the CPU during the boot process instead of [protected mode](https://en.wikipedia.org/wiki/Protected_mode) (which is used when kernel comes into action). In real mode, you have access to some [BIOS interrupt calls](https://en.wikipedia.org/wiki/BIOS_interrupt_call) and to only 16-bits of 32-bit CPU registers.


# Getting started!

As we don't have an option but to write our bootloader in the CPU specific assembly language (as we don't have our operating system ready yet), we need a compiler for this. I chose to use [NASM](https://en.wikipedia.org/wiki/Netwide_Assembler) for compiling. And I'm using a ubuntu OS to write my kernel.

You can install **nasm** by:
```
apt-get install nasm
```

Now we can write our bootloader in assembly and compile it with nasm, Yay!. Once we got the compiled output we will write it to a USB stick and boot our CPU with that USB, Noooo! we won't be using a real CPU, instead we will use an x86 emulator named **qemu**.

You can install **qemu** by:
```
apt-get install qemu
```
