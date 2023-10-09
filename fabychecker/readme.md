## Description

When you're conducting fuzzing tests, it's important to verify whether your fuzzing is working correctly. To do this, you can identify a known endpoint on the target site and insert it into your wordlist. This way, you can confirm that your fuzzing is functioning as intended. For instance, if you know that '/blabla/' exists, you can add it to your wordlist to ensure the effectiveness of your fuzzing tests.

### Command:
```sh
./fabychecker.sh "9999.php" 4 w.txt
```

### output

```
1.php
2.php
3.php
4.php
9999.php
5.php
6.php
7.php
8.php
9999.php
9.php
10.php
11.php
12.php
9999.php
13.php
14.php
15.php
16.php
9999.php
17.php
18.php
19.php
20.php
```
