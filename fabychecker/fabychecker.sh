#!/bin/bash

# Check for correct number of arguments
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <text> <number> <wordlist>"
  exit 1
fi


text="$1"
number="$2"
wordlist_file="$3"

if [ ! -f "$wordlist_file" ]; then
  echo "Hey man! Are you fucking blind?! The file \"$wordlist_file\" not exist"
  exit 1
fi


wordlist_len=$(wc -l < "$wordlist_file")

if ((number < 1)) ||((number > wordlist_len)); then
   echo "Ah Okay, Are you shitting me!? or are you crazy???"
   exit 1
fi



normalize=$((number+1))
sp=$(echo $((wordlist_len / normalize)) | awk '{printf "%.0f\n", $1 + 0.2}')
current_line=0
flag=1

while read -r line; do
  if ((current_line == sp)) && ((flag <= number)); then
    echo "$text"
    current_line=0
    ((flag++))
  fi
  ((current_line++))
  echo "$line"
done < "$wordlist_file"
