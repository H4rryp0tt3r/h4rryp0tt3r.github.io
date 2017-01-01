---
layout: post
title: InCTF 2014 - Forensics 400 - MODIfied
date: 2014-03-08 19:17:11.000000000 +05:30
type: post
published: true
status: publish
author: Nagesh Podilapu a.k.a H4rryp0tt3r
assetID: c3755d830c55fba8e3cf519643f69f6a
---
Every time when I see a stego challenge, I am very frustrated at first but in the end I feel like I achieved something. Stegano challenges keep on changing with different type of tricks.
This time it's quite a difficult trick but not beyond our imagination. In this challenge they gave an image of Modi.

{% include image.html url="/assets/c3755d830c55fba8e3cf519643f69f6a/modified.png" description="MODIfied image" %}

File name `MODIfied.png` itself indicating that it's modified. After some careful observations I stumbled upon some pixels in the white border that are modified which are in 1st column of the image.

{% highlight text %}
(255, 255, 255)
(255, 255, 254)
(255, 255, 255)
(255, 255, 254)
(255, 255, 254)
(255, 255, 255)
(255, 255, 254)
(255, 255, 254)
(255, 255, 255)
(255, 255, 254)
{% endhighlight %}

Then I extracted all the pixels in the 1st column of the white border. After observing some of the pixels I found some of the pixels with 254 values at blue layer, But that's different from a white pixel (255,255,255).
After that I assumed 255 as 0 and 254 as 1 (MODIfied=1) and got a binary string, after converting it into string I got the flag. Here is the python script that will do the job.

{% highlight python %}
#Written by H4rryp0tt3r
from PIL import Image
a=Image.open('MODIfied.png','r')
pix=list(a.getdata())
mo_i=[]
for i in range(0,len(pix)):
	if((i+1)%804==1):
		mo_i.append(pix[i])
bina=""
for j in mo_i:
	if(j[2]==255):
		bina+="0"
	else:
		bina+="1"
flag=""
print "[+] Checking for Flag ..."
print "[+] Found a flag..."
for i in range(0,len(bina),8):
	flag+=chr(int(bina[i:i+8],2))
print flag
print "[+] Oh! Here it is..."
{% endhighlight %}

And the Flag is: **{m0d1_thE_NeW_Pm}**

Team [r3b00+;][r3b00t-link]{:target="_blank"} awarded with 400 points

[r3b00t-link]: https://ctftime.org/team/4882