#!/usr/bin/python3

import time
import argparse
import requests
from bs4 import BeautifulSoup
import sys
from urllib.parse import urlparse

headers ={
  'User-Agent':'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0',
  'Connection': 'keep-alive',
  'Cookie': 'cookie_consent_functional=allow; cookie_consent_analytical=allow; cf_clearance=nTDfHEP4FdCVVTbv._XhBTHMmnG7bRIAU2k1yLjikw8-1687783804-0-250; XSRF-TOKEN=eyJpdiI6IlV1Z0Q4cVVscHljSHR1dVJoZXdzQkE9PSIsInZhbHVlIjoiNnFqOVwvUkVNVFl4WHptY0ZpR2d5QkNFN21FSnNqWHBYZ1R5ZXpTNGlKVXVqM1RDUExGeXZKN2JyczJuXC8rSFp0IiwibWFjIjoiMWVhYmY5NDIwNDkyOGJmYmVkZDc1YzU1MDA0ZTExNjE5ZjRiYmU5MDU4NzY4MWMyYjg4ZDkzYjE2YTU2OTJjNCJ9; abuseipdb_session=eyJpdiI6ImtuOGhtK3p1Ym5vOFQ4Q1FKSXd0QUE9PSIsInZhbHVlIjoiK2pkQW1udVRlZVJVeGJwUXBhTVNNYXVKUU95d1dPcHVOT3ZwQWV2WXNycEF3dnIrZDB6a0FHeWVtMnQrcXRzRSIsIm1hYyI6ImMyYjQwOTU0Y2IzY2RmODJlMTY0ZDE1MDVmZDNkMTAyYWY4NmE1MmY2ZjI0YTY1ZTY4ZThmZjk2MWYzZWQ5YTIifQ%3D%3D'
}

def extract_subdomains(url,silent):
    response = requests.get(f"https://www.abuseipdb.com/whois/{url}", headers=headers,verify=True)
    time.sleep(2)
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        subdomains_header = soup.find('h4', string='Subdomains')
        if subdomains_header:
            subdomains = subdomains_header.find_next('ul').find_all('li')
            subdomain_list = [subdomain.text for subdomain in subdomains]
            return subdomain_list
        else:
            if not silent : print(f"No subdomains found for {url}")
    else:
       if not silent :
           print(f"The CDN blocked us!: {response.status_code}")
           sys.exit(1)


    return []

def add_main_domain_if_missing(url, subdomain):
    if not url.startswith(subdomain):
        if url.startswith('www.'):
            url = url[4:]
        return subdomain +"."+ url
    else:
      return subdomain


def process_urls(urls, output_file=None, silent=False):

    for url in urls:
        if not url:
            continue
        subdomains = extract_subdomains(url,silent)
        if not silent:
            for subdomain in subdomains:
                print(add_main_domain_if_missing(url, subdomain))

    if output_file:
        with open(output_file, 'w') as f:
            for subdomain in subdomains:
                f.write(add_main_domain_if_missing(url, subdomain) + '\n')
    elif not silent:
        for subdomain in subdomains:
            print(add_main_domain_if_missing(url, subdomain))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Extract subdomains from URLs')
    parser.add_argument('-urls', nargs='*', help='URLs to extract subdomains from')
    parser.add_argument('-o', dest='output_file', help='Save subdomains to a file')
    parser.add_argument('-s', '--silent', action='store_true', help='Silent mode')
    args = parser.parse_args()

    urls = args.urls

    if not urls and not sys.stdin.isatty():
        urls = sys.stdin.read().splitlines()

    if not urls:
        print('No URLs provided.')
        sys.exit(1)

    process_urls(urls, output_file=args.output_file, silent=args.silent)
