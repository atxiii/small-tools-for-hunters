# Small Tools for Hunters
Welcome to the "Small Tools for Hunters" repository! Here, I share a collection of useful tools for hunters and security enthusiasts. The tools are designed to assist in various hunting activities, including domain and subdomain reconnaissance, certificate analysis, and gathering inetnum information from RIRs (ARIN, RIPE, APNIC, AFRINIC) and more...

I am committed to maintaining and updating these tools to ensure they remain effective and relevant. Your support is greatly appreciated, so don't forget to give the tools a star if you find them useful!

Happy hunting!


## Reverse Whois for Inetnum
Perform a Reverse Whois lookup for Inetnum information using the Regional Internet Registries (RIRs) - ARIN, RIPE, APNIC, and AFRINIC.

The Regional Internet Registries (RIRs) are organizations responsible for the allocation and management of IP addresses and Autonomous System Numbers (ASNs) within their respective regions. By leveraging the data from these RIRs, you can retrieve valuable information about IP address ranges and the organizations that hold them.

This tool allows you to gather Inetnum information from the RIRs, providing insights into IP address allocations and ownership. It can be useful for network analysis, security investigations, and understanding the Internet landscape.

Enjoy exploring the Inetnum data from ARIN, RIPE, APNIC, and AFRINIC, and uncover valuable information about IP address assignments and the organizations behind them

Example:
```bash
echo "google" | revwhois
cat targets_IPs | revwhois
cat "0.0.0.0" | revwhois
```

## Discovery of Domains and Subdomains in SANs
Discover and explore the domains and subdomains present in the Subject Alternative Names (SANs) of SSL/TLS certificates.

SSL/TLS certificates commonly include SANs, which allow a single certificate to secure multiple domains and subdomains associated with a particular entity. By analyzing the SANs of certificates, you can uncover additional domains and subdomains that may be associated with a target organization or website.

This tool facilitates the discovery process by extracting and presenting the domains and subdomains found in the SANs of SSL/TLS certificates. It can be a valuable asset for reconnaissance, security assessments, and enumeration exercises, providing insights into the broader digital footprint of a target.

Uncover hidden domains, identify related subdomains, and gain a comprehensive view of the certificate's scope by leveraging the SAN information. Expand your knowledge about a target's online presence and enhance your security assessments using this tool.

Happy hunting as you explore and discover the domains and subdomains within the SANs of SSL/TLS certificates!

```bash
crtsh -u thewaltdisneycompany.com --silent | sans | tee thedisney-sans.subs
cat subs | sans -d 3| tee m-sans.subs
echo "target.tld" | sans -d 4 | tee target-sans.subs
```

