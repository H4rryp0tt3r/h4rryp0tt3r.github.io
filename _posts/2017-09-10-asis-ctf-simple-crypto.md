---
layout: post
title: ASIS CTF - Simple Crypto!
date: 2017-09-10 16:27:10.000000000 +05:30
excerpt: "A simple crypto challenge, where we have to decrypt given encrypted text using xor cipher."
type: post
published: true
status: publish
author: Nagesh Podilapu a.k.a H4rryp0tt3r
assetID: 7587572190d8ddf50b3567f8ddcf2995
---

In this challenge they provided encrypted flag contents in a file named [flag.enc][flag-enc]{:target="_blank"} and the encryption implementation below

<script src="https://gist.github.com/H4rryp0tt3r/ffb90f9114ebd7fe337ab0a841423c59.js"></script>

This is a simple XOR cipher, and as we know x ⊕ y == y ⊕ x. So after understanding the above code, all we need to do is just XOR contents of flag.enc with key contents (repeat the key to match length of flag.enc contents). So I quickly wrote a python snippet to decrypt.

// DECRYPT_SNIPPET_HERE

And decrypted data is a PNG image (linux file command will help), here it is

{% include image.html url="/assets/7587572190d8ddf50b3567f8ddcf2995/flag.png" description="Flag for this challenge!" %}


[flag-enc]: {{site.url}}/assets/{{page.assetID}}/flag.enc
