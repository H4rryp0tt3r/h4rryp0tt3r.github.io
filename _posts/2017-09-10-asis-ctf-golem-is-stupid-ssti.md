---
layout: post
title: ASIS CTF - Web 1 - Golem is stupid!
date: 2017-09-10 16:27:10.000000000 +05:30
excerpt: "A web security challenge, where we have to exploit a functionality of jinja templates with in a python flask framework based web application"
type: post
published: true
status: publish
author: Nagesh Podilapu a.k.a H4rryp0tt3r
assetID: 95636442e273569823125d6ace216d4b
---

First of all thanks to ASIS team for organizing a great CTF! I enjoyed solving this challenge, and in the process of pwning I get to learn a lot of stuff. I'm going to explain everything in as much detail as possible.

They gave a web page running at [https://golem.asisctf.com/][challenge-link]{:target="_blank"}, 

{% include image.html url="/assets/95636442e273569823125d6ace216d4b/golem_front.png" description="Home page of the given challenge!" %}

All this app is doing is taking input and greeting us back with input and asking us to read an article (weird though!)

{% include image.html url="/assets/95636442e273569823125d6ace216d4b/second_page.png" description="After giving input as 'hello' in the first page" %}

After looking into response headers it became evident that this app is running over an nginx server. After a few minutes of fiddling we managed to find an LFI at the article link.
Link is pointing to `https://golem.asisctf.com/article?name=article`, I tried path traversal on `name` parameter. And yes! we can read contents of well known files like `/etc/passwd` using this, but we don't know where the flag is, so we have to read source code of the server. In order to find where source is located we need to read nginx configuration. So, with `name=../../../../etc/nginx/nginx.conf` I was able to read contents of that file. 

<pre>
##
# Virtual Host Configs
##
## configs: default, golem
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
</pre>

So, now with `name=../../../etc/nginx/sites-enabled/golem`

<pre>
location / {
    uwsgi_pass golem;
    include uwsgi_params;
}

location /static/ {
    root /opt/serverPython/golem;
    expires 30d;
}
</pre>

Now we know the root folder of this application which is `/opt/serverPython/golem`, with few educated guesses (main.py, init.py etc.) I found server.py in app root folder.

<script src="https://gist.github.com/H4rryp0tt3r/697fa556eddb47a825bb6aae28258315.js"></script>

So, this is a python flask framework based web app. And obviously eyes glazed over flag.py, but we can't read it as there is a condition in server.py which is not allowing us to read. Next candidate is key.py and using `name=../../../opt/serverPython/golem/key.py`

{% highlight python %}
key = "7h15_5h0uld_b3_r34lly_53cur3d"
{% endhighlight %}

### **From LFI to RCE (Remote command execution)!**

After a lot of struggle and search on internet I found an interesting attack vector named **SSTI(Server side template injection)**.

It's time for an ExPl0itAti0N.

If you closely observe server.py (line 24), it uses a template engine(Jinja2 to be specific) to render html content, and in one of the template it is printing what ever is there in session (cookie in browser terms).

Now back to our SSTI, when user input some string like **\{\{ 2+3 \}\}**, jinja template engine will evaluate it and output the result(which is `5`). So now all we need to do is craft a session with some code to read flag.py.

Here comes the interesting part, this app uses flask Session class which gives us HMAC signed cookies using a secret key (server.py line 11), so that when someone sends edited cookie back to server, server will try and verify the signature. So one can't simply edit flask sessions. As we have secret_key with us (as we have already read key.py), we can create and sign sessions manually and send it to server for evaluation. So I quickly wrote a small script to generate crafted sessions and send it to server.

<script src="https://gist.github.com/H4rryp0tt3r/d5aa11980f41b90b0370174a8d02dcaf.js"></script>

Here is the console output, in the above script I'm filtering server response to print only what we need.

<script src="https://gist.github.com/H4rryp0tt3r/2fa8f50b840c5bb8195c606fa6e5700c.js"></script>

**References**

[Exploring SSTI in Flask/Jinja2 (I recommend reading this!)][flask-ssti]{:target="_blank"}

[Flask Framework][flask-link]{:target="_blank"}
 

[challenge-link]: https://golem.asisctf.com/
[flask-link]: http://flask.pocoo.org/
[flask-ssti]: https://nvisium.com/blog/2016/03/09/exploring-ssti-in-flask-jinja2/
