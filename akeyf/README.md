# API key finder (akeyf)

The code is :

```bash
akeyf () {
        domain=$1
        echo "[hakrawal...]"
        echo $domain | httpx -silent | hakrawler | anew "u.txt"
        echo "[wayback...]"
        echo $domain | waybackurls | anew "u.txt"
        echo "[gau...]"
        echo $domain | /root/go/bin/gau | anew "u.txt"
        echo "[waymore...]"
        waymore -i $domain -mode U | anew "u.txt"
        echo "[Service Discovery...]"
        cat u.txt | grep --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn,.idea,.tox} -E "\.js$" | httpx -silent | anew url.js.txt
        echo "[secretfinder starting...]"
        cat url.js.txt | while read url
        do
                secretfinder -i $url -o cli
        done
}

```

you can save it on you ~/.zshrc

or you can use the below code and save it as akeyf.sh

```bash
#!/bin/bash
domain=$1
echo "[hakrawal...]"
echo $domain | httpx -silent | hakrawler | anew "u.txt"
echo "[wayback...]"
echo $domain | waybackurls | anew "u.txt"
echo "[gau...]"
echo $domain | /root/go/bin/gau | anew "u.txt"
echo "[waymore...]"
waymore -i $domain -mode U | anew "u.txt"
echo "[Service Discovery...]"
cat u.txt | grep --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn,.idea,.tox} -E "\.js$" | httpx -silent | anew url.js.txt
echo "[secretfinder starting...]"
cat url.js.txt | while read url
do
        secretfinder -i $url -o $PWD/secretfinder.result.txt
done
```

# How can I run it?

```bash
# if you paste the code on zshrc
akeyf target.com
# or if you using a bash file
./akeyf.sh target.com
```

# How it works:

This script uses the several tools:

- hakrawal
- waybackurls
- gau
- waymore
- httpx
- secretfinder
- anew

### Review code

 `domain=$1`

- Get the domain name from user and save it on domain variable

`echo $domain | httpx -silent | hakrawler | anew "u.txt"`

- After Http discovery, pass the domain to hakrawler and append unique urls to the file “u.txt”

 `echo $domain | waybackurls | anew "u.txt"`

- Append unique wayback urls to the file

`echo $domain | /root/go/bin/gau | anew "u.txt"`

- Append unique urls from gau to the file

`waymore -i $domain -mode U | anew "u.txt"`

- -mode U returns the url, so we append result to the file

`cat u.txt | grep --color=auto --exclude-dir={.bzr,CVS,.git,.hg,.svn,.idea,.tox} -E "\.js$" | httpx -silent | anew url.js.txt`

- Extract js files from urls that we saved on u.txt and save on url.js.txt

`secretfinder -i $url -o $PWD/secretfinder.result.txt`

- Within a while loop we check all js files via secretfinder and save the result on `secretfinder.result.txt` .

Note: secretfinder is a symlink in the above codes, so you can do this before run the code:

- First move to the path of secreftfinder.
- Second run this code on you bash

```bash
ln -s $PWD/SecretFinder.py /usr/bin/secretfinder
```

## What’s Next:

you can improve it and customize according your requirements. for example:

- exclude same content-length
- just search on 404 and 200 status codes
- extract the API key and unique them, finally pass them to hak-keys curls
- use jsluice after secret finder
- use mantra and combine it
- and more.
