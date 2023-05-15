+++
title="InCTF 2014 - Web 300 writeup"
date="2014-03-08"
description="A web security writeup on SQL Truncation vulnerability that we used to solve a challenge in InCTF 2014"
author="Nagesh Podilapu"
aliases=["2014/03/08/inctf-2014-web-300.html"]
[taxonomies]
tags=["ctf", "web", "SQLi"]
+++

In this challenge they gave a website like below with a simple form with GET Method.

![Front page of the given challenge](front_screen.png)

And the source of the form is given as well

```html
<h1>File Share</h1>
<span style="color: green;"><strong>View your files</strong></span>
<form method="GET">
<table>
<tbody>
<tr>
<td align="right">File Name:</td>
<td align="left"><input type="text" name="filename" placeholder="*.txt " /></td>
</tr>
<tr>
<td align="right"><img alt="" src="captcha.php" /> :</td>
<td align="left"><input type="text" name="vercode" /></td>
</tr>
<tr>
<td></td>
<td align="left"><input type="submit" value="Submit" /></td>
</tr>
</tbody>
</table>
</form>
 <!-- Source : view.php~ -->
```

and after looking at the given source page, I found a link to php code of the web page

```php
<?php
include 'db.php';
if(isset($_GET['vercode']) && isset($_GET['filename'])){
    session_start();
    if ($_GET['vercode'] != $_SESSION["vercode"] OR $_SESSION["vercode"]==''){
        die("Wrong Captcha..");
    }
    $filename = mysql_real_escape_string($_GET['filename']);
    $id       = md5(mt_rand().rand());

    if(preg_match('/\.\.|(\.php$)/is',$filename))    die('Can\'t read php files..');
    $query = mysql_query("INSERT INTO foo VALUES('$id','$filename');");
    if($query)
        die("View your file: <a href="?id=$id">here</a>\n");
    else
        die("Something went wrong..");
    mysql_free_result($query);
}
if(!empty($_GET['id'])){
    $id      = mysql_real_escape_string($_GET['id']);
    $query   = mysql_query("SELECT * FROM foo WHERE id='$id'");
    if(!$query) die("Something went wrong..");
    while ($row = mysql_fetch_array($query)) {
        echo $row['FILENAME'];
        if (file_exists('./files/'.$row['FILENAME'])) {
            echo file_get_contents('./files/'.$row['FILENAME']);
        }
        else {
            die('No such file');
        }
 }
 mysql_free_result($query);
}
mysql_close();
?>
```

And it's a difficult challenge for me to get contents of flag.php, so I waited for hints and just before 2 days to the end of contest admin released a hint for this challenge which is an image containing text **truncation**.

Then I understood that I have to do something with SQL Truncation. After reading some blogs, I understood that, If we try to insert a value into a column greater than it's length, it will insert only the part until the length and ignores the rest.

Example: This is a description of a table named `data` with a column `FILNAME` with length of 30.

```
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| id       | varchar(35) | YES  |     | NULL    |       |
| FILENAME | varchar(30) | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

And If you insert a value of length 32 like below.
```
INESRT INTO DATA VALUES('myID','d4c9fcb601ebe8aa8d4ab59dcdbf692a');
```
After executing the above query, contents of table are

```
+------+--------------------------------+
| id   | FILENAME                       |
+------+--------------------------------+
| myID | d4c9fcb601ebe8aa8d4ab59dcdbf69 |
+------+--------------------------------+
```

If you would have observed, even if we insert a value of length 32 into column **FILENAME** only 30 characters added to table and rest of the string **2a** got skipped.

And then all I had to do is to find out length of the filename column by giving 500 A's as input to it, but script printed 110 A's only. Which means our filename column length is 110. So after that, I came up with this payload

```
./././././././././././././././././././././././././././././././././././././././././././././././././././flag.php~
```

**~** character at the end bypasses the regular expression **/\.\.|(\.php$)/is** and skipped by the insert query because it's the 111th character.
That gives us the contents of flag.php in source page.

```php
<?php
$leet = "53714c5f63306c756d6e5f7472756e63407469306e";
function hex2str( $hex ){
    return pack('H*', $hex);
}
echo "flag{".md5(hex2str($leet))."}";
?>
```

After executing that php code I got the flag.

Flag is: **flag{f89759dab5b6ef402428c4571040c067}**

Thanks for reading and thanks to team **bi0s** for making a great CTF and introducing me to different attack vectors.
