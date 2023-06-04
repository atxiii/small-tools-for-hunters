#!/usr/bin/env python

import argparse
import requests
from bs4 import BeautifulSoup
import sys
from urllib.parse import urlparse

DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

def extract_subdomains(url,silent):
    headers = {'User-Agent': DEFAULT_USER_AGENT}
    response = requests.get(f"https://www.abuseipdb.com/whois/{url}", headers=headers)
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
       if not silent : print(f"The CDN blocked us!: {response.status_code}")

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
            print(f"Subdomains for {url}:")
            for subdomain in subdomains:
                print(add_main_domain_if_missing(url, subdomain))
            print()

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
