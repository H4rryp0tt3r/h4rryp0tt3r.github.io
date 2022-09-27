+++
title="Tokyo Westerns CTF 2017 - Reversing 1 - Rev Rev Rev"
date="2017-09-04"
description="A ELF reversing challenge written in C, where we have to capture a calculated string passed to strcmp function. I solved it using angr framework."
author="Nagesh Podilapu"
[taxonomies]
tags=["ctf", "reversing", "exploitation", "python"]
+++

After a long time, I spent a reasonable amount of time in a CTF named Tokyo Westerns CTF. I'm going to write about a reversing challenge titled "Rev! Rev! Rev!".

In this challenge they gave a binary named [rev_rev_rev](rev_rev_rev), which is a 32-bit ELF LSB executable. As a first step I executed it and it's asking for a string input and I gave a random string and it printed **Invalid!** on the screen, which is quite obvious.

```
➜  Desktop $ ./rev_rev_rev
Rev! Rev! Rev!
Your input: Hello
Invalid!
```

So I have to figure out a string which it can accept. As usual I did used **readelf** command to read entrypoint and other function calls with in the binary.

And then I did **strings rev_rev_rev** which resulted in some strings

```
Rev! Rev! Rev!
Your input:
Input Error.
Correct!
Invalid!
```

By seeing the strings in binary, I got to know that If I provide a proper string as an input then it will print **'Correct!'** on the screen. I started by loading the binary into **gdb** and saw the disassembled code which is quite complex for me to understand considering the skill I have in assembly.

Here comes! Symbolic code execution engine for rescue, I know a framework named **angr** but never used it before. So decided to use it for this challenge as it seems like a pretty simple challenge to crack with angr.

I quickly wrote a small script to find a path which leads the binary to print **'Correct!'** on the screen.

```python
import angr
project = angr.Project("rev_rev_rev", auto_load_libs=False)
path_group = project.factory.path_group()
path_group.explore(find=lambda path: 'Correct!' in path.state.posix.dumps(1))
print "Flag is:" + path_group.found[0].state.posix.dumps(0)
```

It took **16.25s** to find the input which is our flag.

```
➜  Desktop $ time python exploit.py
WARNING | 2017-09-04 12:14:56,001 | claripy | Claripy is setting the recursion limit to 15000. If Python segfaults, I am sorry.
Flag is: TWCTF{qpzisyDnbmboz76oglxpzYdk}
```

```
➜  Desktop $ ./rev_rev_rev
Rev! Rev! Rev!
Your input: TWCTF{qpzisyDnbmboz76oglxpzYdk}
Correct!
```

Yay! [angr](http://angr.io) is a really cool framework. Do read more about it, If you haven't.
