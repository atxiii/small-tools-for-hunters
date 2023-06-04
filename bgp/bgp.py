#!/usr/bin/python3

import argparse
import requests
import concurrent.futures
import sqlite3
import json
import sys
import os

DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

FILTER_OPTIONS = {
    "ip":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "p": ("prefixes",["data", "prefixes"]),
        "r": ("rir_allocation",["data", "rir_allocation"]),
        "l": (" related_prefixes",["data", " related_prefixes"]),
    },
    "asn":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "a": ("asn",["data", "asn"]),
        "n": ("name",["data", "name"]),
        "d": ("description_short",["data", "description_short"]),
        "e": ("email_contacts",["data", "email_contacts"]),
    },
    "prefixes":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "4":("ipv4",["data", "ipv4_prefixes"]),
        "6":("ipv6",["data", "ipv6_prefixes"]),
    },
    "peers":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "4":("ipv4",["data", "ipv4_peers"]),
        "6":("ipv6",["data", "ipv6_peers"]),
    },
    "upstreams":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "4":("ipv4",["data", "ipv4_upstreams"]),
        "6":("ipv6",["data", "ipv6_upstreams"]),
    },
    "downstreams":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "4":("ipv4",["data", "ipv4_downstreams"]),
        "6":("ipv6",["data", "ipv6_downstreams"]),
    },
    "ixs":{
        "v":("data",["data"]),
        "s":("status",["status"]),
    },
    "ix":{
        "v":("data",["data"]),
        "s":("status",["status"]),
        "n":("name",["data","name"]),
        "w":("website",["data","website"]),
        "t":("tech_email",["data","tech_email"]),
        "o":("policy_email",["data","policy_email"]),
        "m":("members",["data","members"]),
    },
    "prefix":{
        "v":("data",["data"]),
        "s":("status",["status"]),
        "i":("ip",["data","ip"]),
        "a":("asns",["data","asns"]),
        "c":("cidr",["data","cidr"]),
        "p":("prefix",["data", "prefix"]),
        "n":("name",["data", "name"]),
        "d":("description",["data", "description_short"]),
        "e":("email_contacts",["data", "email_contacts"]),
    },
    "search":{
        "s":("status",["status"]),
        "v":("data",["data"]),
        "4":("ipv4",["data", "ipv4_prefixes"]),
        "6":("ipv6",["data", "ipv6_prefixes"]),
        "a":("asns",["data", "asns"]),
    },
}

ENDPOINTS = {
    "asn": "https://api.bgpview.io/asn/{i}",
    "prefixes": "https://api.bgpview.io/asn/{i}/prefixes",
    "peers": "https://api.bgpview.io/asn/{i}/peers",
    "upstreams": "https://api.bgpview.io/asn/{i}/upstreams",
    "downstreams": "https://api.bgpview.io/asn/{i}/downstreams",
    "ixs": "https://api.bgpview.io/asn/{i}/ixs",
    "prefix": "https://api.bgpview.io/prefix/{i}",
    "ip": "https://api.bgpview.io/ip/{i}",
    "ix": "https://api.bgpview.io/ix/{i}",
    "search": "https://api.bgpview.io/search?query_term={i}",
}


def fetch_data(input, ref):
    url = ENDPOINTS[ref].format(i=input)
    response = requests.get(url)
    data = response.json()
    return data

def get_value_by_path(data, filters):
    value = data
    for filter in filters:
        value = value[filter]
    return value


def apply_filters(input, args):
    connection = sqlite3.connect("cache.db")
    cursor = connection.cursor()

    ref = args.ref[0]
    cache_key = f"{ref}_{input}"
    filtered_data = {}

    try:
        cursor.execute("SELECT data FROM cache WHERE key=?", (cache_key,))
        result = cursor.fetchone()
    except Exception as e:
        print(f"Error occurred: {e}")

    if result is not None:
        data = json.loads(result[0])
    else:
        data = fetch_data(input, ref)
        try:
            cursor.execute("INSERT INTO cache (key, data) VALUES (?, ?)", (cache_key, json.dumps(data)))
            connection.commit()
        except Exception as e:
            print(f"Error occurred: {e}")


    if args.filter:
        options = args.filter[0]
        for option in options:
            filter_name, data_path = FILTER_OPTIONS[ref][option]
            filtered_data[filter_name] = get_value_by_path(data, data_path)
    else:
        filtered_data = data

    filtered_data['target']= input
    json_data = json.dumps(filtered_data, indent=4)
    print(json_data)

    connection.close()


def main(args):
    input = args.input

    if input:
       with open(input, 'r') as file:
           inputs = file.read().splitlines()

    if not input and not sys.stdin.isatty():
        inputs = sys.stdin.read().splitlines()

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(apply_filters, i, args) for i in inputs]
        concurrent.futures.wait(futures)

def make_db():
    connection = sqlite3.connect("cache.db")
    connection.execute("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, data TEXT)")
    connection.close()

def is_cache_db_exist():
    return os.path.exists("cache.db")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='BGPview API')
    parser.add_argument('-ref', nargs='*', help='Add your reference')
    parser.add_argument('-o', dest='output_file', help='Save data to a file')
    parser.add_argument('-i', '--input', help='Input')
    parser.add_argument('-f', '--filter', nargs='+', help='Filters to apply')
    parser.add_argument('-s', '--silent', action='store_true', help='Silent mode')
    args = parser.parse_args()

    if not is_cache_db_exist():
        make_db()

    main(args)
