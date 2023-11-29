#!/usr/bin/env python3
import argparse
import PyPDF2
import re
from urlextract import URLExtract
extractor = URLExtract()

def extract_urls_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        urls = []
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            extracted_urls = extractor.find_urls(text)
            urls.extend(extracted_urls)
        return urls

def main():
    parser = argparse.ArgumentParser(description='Extract URLs from a PDF file')
    parser.add_argument('file_path', help='Path to the PDF file')
    args = parser.parse_args()

    extracted_urls = extract_urls_from_pdf(args.file_path)
    for url in extracted_urls:
        print(url)

if __name__ == "__main__":
    main()
