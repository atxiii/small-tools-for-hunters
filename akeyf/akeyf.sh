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
