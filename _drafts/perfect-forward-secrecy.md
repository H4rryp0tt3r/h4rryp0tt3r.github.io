---
layout: post
title: Introduction to Perfect Forward Secrecy
excerpt: "A brief introduction to Perfect forward secrecy. How will this impact our secure communications, why should be care about it."
type: post
author: Nagesh Podilapu a.k.a H4rryp0tt3r
assetID: 834e13c69c3f9a4b6cea0ff6626a02dd
---
Ever heard about heatbleed?.... The Heartbleed bug allows anyone on the Internet to read the memory of the systems protected by the vulnerable versions of OpenSSL software. This compromises private keys that used to decrypt HTTPS requests. This allows attackers to eavesdrop on communications, steal data directly from the services and users and to impersonate as well.

{% include image.html url="/assets/834e13c69c3f9a4b6cea0ff6626a02dd/heartbleed_explanation_2x.png" description="Popular xkcd on heartbleed bug" %}

### **What happened before Perfect Forward Secrecy?**

Prior to the implementation of PFS, all data transmitted between a server and a client could be compromised if the server's private key was ever disclosed. The ability to decrypt the historic data is there because we rely on a single key pair from server which is used in establishing secure connection.

{% include image.html url="/assets/834e13c69c3f9a4b6cea0ff6626a02dd/ssl-handshake.png" description="Usual SSL Handshake" %}
If attacker captured all the above mentioned traffic in the above
<br>They have **Random Number #1** and **#2** as they are sent in plain text, along with the **Pre-Master Secret** encrypted with the server public key. Once the attacker has the server private key, they can decrypt the Pre-Master Secret and generate the Master Secret to decrypt the session data.

### **How does Perfect Forward Secrecy help?**

To enable PFS, the client and the server have to be capable of using a cipher suite that utilises the Diffie-Hellman key exchange.
Importantly, the key exchange should be ephemeral (i.e A brand new key for every session). This means that the client and the server will generate a new set of Diffie-Hellman parameters for each session. These parameters can never be re-used and should never be stored. Because of logarithmic math complexity in Diffie-Hellman, the exchange of key material can take place in clear text without compromising the generation of a shared secret.
What's even better is that with Perfect Forward Secrecy, the server generates a new set of Diffie-Hellman parameters for each session. Even if the attacker managed to compromise this shared secret parameters somehow, it would only compromise that particular session. No previous or future sessions would be compromised.

<Image> Diffie-Hellman-Key-Exchange </Image>

### **How do I get Perfect Forward Secrecy?**
Enabling support for Perfect Forward Secrecy on your server is actually fairly straight forward. All we have to do is to support Diffie-Hellman based SSL cipher suites, and we should also enforce the ordering of cipher suites.
[1]http://heartbleed.com/