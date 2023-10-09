## Description

Sometimes you are fuzzing and you don't know your fuzzing are works correctly or not! so you can find a hook from the site and place on your wordlist to make sure your fuzz are working as well.

for example:
I know the /blabla/ is exist. so I spwan it to my wordlist to make sure the fuzzing works well.

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
