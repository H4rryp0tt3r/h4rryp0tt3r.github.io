+++
title="Volga CTF 2014 - Stegano 200 Writeup"
date="2014-03-31"
description="A writeup on steganography challenge in Volga CTF 2014 where I used Least Significant Bit technique."
author="Nagesh Podilapu"
aliases=["2014/03/30/volga-ctf-2014-stegano-200-writeup.html"]
[taxonomies]
tags=["ctf", "steganography", "python"]
+++
In this challenge they Provided a PNG Image named **steg200.png**. And after observing it's LSB pixels with Python PIL(Python Imaging Library) module, I saw a RAR file header. So I wrote a Python script to extract all the PNG LSB Content to a file. Here is the script which produce a RAR file from the given Image.

```python
from PIL import Image
im=Image.open('stego200.png','r')
pix=im.getdata()
bins=""
outfile=open("steg.rar","ab")
for i in pix:
    bins+=bin(i)[-1]
for j in range(0,len(bins),8):
    outfile.write(chr(int(bins[j:j+8],2)))
```

After this step, I looked at archive contents with excitement and there is a file name **flag.txt**, but wait archive is password protected. So I tried so hard to bruteforce that password but no use.

But later admin updated that challenge with a hint saying **Password is a 5 length english Word available in so many dictionary**. So I quickly collected all the 5 length words from an english dictionary, and did brute force with the below script

```python
import commands,re
passlist=open("new.txt","r").read().split("\n")[0:-1]
print "[+] Bruteforcing With 5 Length English Words."
for passwd in passlist:
    # This Below Line Will Skip All The Passwords with Special Characters in it Because We don't need Special Charactes in out password.
    if(re.findall("[.'$-@#!%^&*()+=]",passwd)):
        continue
    res=commands.getstatusoutput("unrar x steg.rar -inul -p"+passwd)
    if(res[0]==0):
        print "[+] Extracted Succesfully!"
        break
```

And After running it
```
harry@localhost Volga $ time python Extract.py
[+] Bruteforcing With 5 Length English Words.
[+] Extracted Succesfully!
```

The Flag is: **{LSB_is_ubiquitous}**

Ho...Hooooooo!!!!! 200 Points for Team [r3b00+](https://ctftime.org/team/4882)
