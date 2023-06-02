#!/usr/bin/env python

import argparse
import requests
from bs4 import BeautifulSoup
import sys
DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

def extract_subdomains(url):
    headers = {'User-Agent': DEFAULT_USER_AGENT}
    response = requests.get(f"https://www.abuseipdb.com/whois/{url}", headers=headers)
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        subdomains_header = soup.find('h4', text='Subdomains')
        if subdomains_header:
            subdomains = subdomains_header.find_next('ul').find_all('li')
            subdomain_list = [subdomain.text for subdomain in subdomains]
            return subdomain_list
        else:
            print(f"No subdomains found for {url}")
    else:
        print(f"Error accessing {url}: {response.status_code}")

    return []

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Extract subdomains from URLs')
    parser.add_argument('-urls', nargs='*', help='URLs to extract subdomains from')
    args = parser.parse_args()

    urls = args.urls

    # If URLs are not provided as command-line arguments, check if input is piped
    if not urls and not sys.stdin.isatty():
        urls = sys.stdin.read().splitlines()

    if not urls:
        print('No URLs provided.')
        sys.exit(1)

    for url in urls:
        subdomains = extract_subdomains(url)
        print(f"Subdomains for {url}:")
        for subdomain in subdomains:
            print(subdomain)
        print()
