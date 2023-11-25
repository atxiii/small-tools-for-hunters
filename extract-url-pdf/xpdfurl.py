#!/usr/bin/env python3
import argparse
import PyPDF2
import re

def validate_url(url):
    # Regular expression pattern to match URLs, allowing for some non-standard characters
    pattern = re.compile(r'^(https?|ftp)://[^\s/$.?#].[^\s]*$')

    # Check if the URL matches the pattern
    if re.match(pattern, url):
        return True
    else:
        return False

def extract_urls_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        urls = []
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            extracted_urls = re.findall(r'(?:http[s]?://)?(?:www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}(?:\S+)?', text)
            urls.extend(extracted_urls)

        return urls

def main():
    parser = argparse.ArgumentParser(description='Extract URLs from a PDF file')
    parser.add_argument('file_path', help='Path to the PDF file')
    args = parser.parse_args()

    extracted_urls = extract_urls_from_pdf(args.file_path)
    for url in extracted_urls:
        if validate_url(url):
            print(url)

if __name__ == "__main__":
    main()
