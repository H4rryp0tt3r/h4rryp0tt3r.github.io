+++
title="ASIS CTF - Simple Crypto!"
date="2017-09-10"
description="A simple crypto challenge, where we have to decrypt given encrypted text using xor cipher."
author="Nagesh Podilapu"
[taxonomies]
tags=["ctf", "xor", "crypto"]
+++

In this challenge they provided encrypted flag contents in a file named [flag.enc][flag.enc] and the encryption implementation below

```python
#!/usr/bin/python

import random
from secret import FLAG 

KEY = 'musZTXmxV58UdwiKt8Tp'

def xor_str(x, y):
    if len(x) > len(y):
        return ''.join([chr(ord(z) ^ ord(p)) for (z, p) in zip(x[:len(y)], y)])
    else:
        return ''.join([chr(ord(z) ^ ord(p)) for (z, p) in zip(x, y[:len(x)])])

flag, key = FLAG.encode('hex'), KEY.encode('hex')
enc = xor_str(key * (len(flag) // len(key) + 1), flag).encode('hex')

ef = open('flag.enc', 'w')
ef.write(enc.decode('hex'))
ef.close()
```

This is a simple XOR cipher, and as we know x ⊕ y == y ⊕ x. So after understanding the above code, all we need to do is just XOR contents of flag.enc with key contents (repeat the key to match length of flag.enc contents). So I quickly wrote a python snippet to decrypt.

```python
encrypted_file = open("flag.enc", "r")
encrypted_contents = encrypted_file.read()
encrypted_file.close()

KEY = 'musZTXmxV58UdwiKt8Tp'.encode("hex")

def xor_str(x, y):
    if len(x) > len(y):
        return ''.join([chr(ord(z) ^ ord(p)) for (z, p) in zip(x[:len(y)], y)])
    else:
        return ''.join([chr(ord(z) ^ ord(p)) for (z, p) in zip(x, y[:len(x)])])

decrypted_contents = xor_str(KEY * (len(encrypted_contents) // len(KEY) + 1), encrypted_contents).decode("hex")

decrypted_file = open("flag.dec", "w")
decrypted_file.write(decrypted_contents)
decrypted_file.close()
```

And decrypted data is a PNG image (linux file command will help), here it is!

![An image displaying flag](flag.png)
