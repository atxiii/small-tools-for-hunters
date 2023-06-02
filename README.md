# Small Tools for Hunters
Welcome to the "Small Tools for Hunters" repository! Here, I share a collection of useful tools for hunters and security enthusiasts. The tools are designed to assist in various hunting activities, including domain and subdomain reconnaissance, certificate analysis, and gathering inetnum information from RIRs (ARIN, RIPE, APNIC, AFRINIC) and more...

I am committed to maintaining and updating these tools to ensure they remain effective and relevant. Your support is greatly appreciated, so don't forget to give the tools a star if you find them useful!

Happy hunting!

## DumpCrt - A Script for Dumping crt.sh Database
DumpCrt is a Bash script designed to extract data from the crt.sh database. It provides an easy way to search for certificates based on various criteria such as target, organization name, and more. The script fetches the data and outputs it to a file, allowing users to analyze and work with the extracted information.

**Usage:**
```bash
./crtsh -u <target> [OPTIONS]
```

**Options:**
- -o | --orgName: Search for certificates based on organization name.
- -u: Specify the target or name for the search.
- --web: Quickly dump data from small targets.
- -l | --limit: Set the limit for the number of records to fetch (default is 300).
- -y | --yaml: Generate output in YAML format (default is false).
- -p | --path: Specify the file path to write the output to.
- -s | --silent: Remove dummy text and generate clean output.
- -h | --help: Display help information.

**Examples:**

Dump certificates for a target and write the output to a file:
```bash
./crtsh -u walmart.com -p ~/target.subs
```

Search for certificates based on an organization name and generate clean output:
```bash
./crtsh -u walmart.com -o --silent
```

Dump certificates for a target and generate output in YAML format:
```bash
./crtsh -u walmart.com -y ~/target.yaml
```
Increase the limit to fetch more records (e.g., 500):
```bash
./crtsh -u walmart --limit 500
```
Fetch a large number of records silently, and write to a file:
```bash
./crtsh -u disney -l 2000 --silent | tee disney-crtsh.subs
```

Fetch data without using the API
```bash
./crtsh -u disney --web | tee disney-crtsh.subs
```

**Notes:**

The script uses the crt.sh API to fetch data from the database.
By default, the script fetches certificates based on the target specified using the -u option.
The `-o` option allows searching for certificates based on the organization name.
The `--web` option provides a faster way to dump data from small targets directly without using the API.
The `-l` option sets the limit for the number of records to fetch. The default limit is 300.
The `-y` option generates output in YAML format, including subdomains from the COMMON_NAME and NAME_VALUE fields.
The `-p` option specifies the file path to write the output to. If not provided, the output is displayed on the console.
The `-s` option removes dummy text and generates clean output, omitting progress information.
The `-h` option displays help information about the script and its options.


## Reverse Whois for Inetnum
Perform a Reverse Whois lookup for Inetnum information using the Regional Internet Registries (RIRs) - ARIN, RIPE, APNIC, and AFRINIC.

The Regional Internet Registries (RIRs) are organizations responsible for the allocation and management of IP addresses and Autonomous System Numbers (ASNs) within their respective regions. By leveraging the data from these RIRs, you can retrieve valuable information about IP address ranges and the organizations that hold them.

This tool allows you to gather Inetnum information from the RIRs, providing insights into IP address allocations and ownership. It can be useful for network analysis, security investigations, and understanding the Internet landscape.

Enjoy exploring the Inetnum data from ARIN, RIPE, APNIC, and AFRINIC, and uncover valuable information about IP address assignments and the organizations behind them

Example:
```bash
echo "google" | revwhois
cat target_ips | revwhois
echo "0.0.0.0" | revwhois
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


> All scripts is provided as-is without any warranties or guarantees. Use it responsibly and at your own risk.


Feel free to customize and enhance this document based on your specific needs and requirements.
[![Twitter Follow](https://img.shields.io/twitter/follow/discoverscripts.svg?style=social&label=Follow)](https://twitter.com/hoseinshurabi)
