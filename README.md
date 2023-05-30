# small-tools-for-hunters
I will share my public tools here and strive to keep them updated in the future. Don't forget to give them a star! Your support is appreciated


# Reverse Whois for Inetnum
Retrieve inetnum information from Regional Internet Registries (RIRs) such as ARIN, RIPE, APNIC, and AFRINIC.

> RIRs responsible for the allocation and management of IP addresses and Autonomous System Numbers (ASNs) within their respective regions.

Example:
```bash
echo "google" | revwhois
cat targets_IPs | revwhois
cat "0.0.0.0" | revwhois
```

# Discovery Domain & Subdomains in SANs
Discover domains and subdomains in SANs (Subject Alternative Names) of SSL/TLS certificates.

```bash
crtsh -u thewaltdisneycompany.com --silent | sans | tee thedisney-sans.subs
cat subs | sans -d 3| tee m-sans.subs
echo "target.tld" | sans -d 4 | tee target-sans.subs
```

