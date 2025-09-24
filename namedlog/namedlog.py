#!/usr/bin/python3

import sys
import requests
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Replace 'WEBHOOK_URL' with your Discord webhook URL
WEBHOOK_URL = ''
LOG_FILE_PATH = '/var/log/named/named.log'

class LogFileEventHandler(FileSystemEventHandler):
    def __init__(self, filter_keyword):
        super().__init__()
        self.filter_keyword = filter_keyword

    def on_modified(self, event):
        if not event.is_directory and event.src_path == LOG_FILE_PATH:
            process_log_file(self.filter_keyword)

def process_log_file(filter_keyword):
    with open(LOG_FILE_PATH, 'r') as file:
        log_entries = file.readlines()
        print(log_entries[-1])

    # Filter the log entries containing the keyword
    if filter_keyword in log_entries[-1].lower():
        print('Bingo')
        payload = {
            'content': log_entries[-1]
        }
        requests.post(WEBHOOK_URL, json=payload)

def main(filter_keyword):
    # Create the observer and event handler
    event_handler = LogFileEventHandler(filter_keyword)
    observer = Observer()
    observer.schedule(event_handler, path=LOG_FILE_PATH.rsplit('/', 1)[0], recursive=False)

    # Start monitoring the log file
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python script.py FILTER_KEYWORD")
        sys.exit(1)

    filter_keyword = sys.argv[1]
    main(filter_keyword)
