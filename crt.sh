#!/bin/bash

# Script Name: DumpCrt
# Description: A script for dumpping crt.sh database
# Author: Hossein Sh.
# Created: 2023 M05 26, Fri 05:43
# Version: v1.2.0
#

# Script body starts here

RED='\033[0;31m'   # Red color
GREEN='\033[0;32m' # Green color
ORANGE='\033[0;33m' # Green color
NC='\033[0m'       # No color.
url_validator(){
 if [[ $1 =~ ^([a-zA-Z]+://)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$ ]]; then
     echo $1 >&1
 fi
}
print_help() {
    echo "Usage: $0 <target> [OPTIONS] "
    echo ""
    echo "OPTIONS: [u:l:p:oysh]"
    echo "  -o| --orgName             Search on Organization Name"
    echo "  -u                        Target or name"
    echo "  --web                     A fast way to dump data from small targets"
    echo "  -l| --limit               Default limit is 300"
    echo "  -y| --yaml                The default value of yaml is false, which means it will only return subdomains from the COMMON_NAME and NAME_VALUE fields in output"
    echo "  -p| --path                File to write output to"
    echo "  -s| --silent              Remove dummy text and get clean output"
    echo "  -h| --help                Help!"
    echo "Examples:"
    echo "     ./crtsh -u walmart.com -p ~/target.subs"
    echo "     ./crtsh -u walmart.com -o --silent"
    echo "     ./crtsh -u walmart.com -y ~/target.yaml"
    echo "     ./crtsh -u walmart --limit 500"
    echo "     ./crtsh -u disney -l 2000 --silent -y | tee disney-crtsh.subs"
    echo ""
    echo ".:.:.:.:.:.:.:.:.:.:."
    echo "Author: TheCatFather"
    echo ""
}

loading_animation() {
    local -r animation_frames=("◐" "◓" "◑" "◒")
    local -r total_frames=${#animation_frames[@]}
    local -r delay_seconds=0.1

    local frame_index=0
    while :; do
        printf "${ORANGE}[%s]Counting Records...${NC}\r " "${animation_frames[frame_index]}" >&2
        frame_index=$(( (frame_index + 1) % total_frames ))
        sleep "$delay_seconds"
    done
}


############################################### Vars
offset=0
MAX_RETRIES=50
MAX_RETRIES_count=20
RETRY_DELAY=5
retries=0
org_flag=false
sub_flag=true
limit=300
count=0
target=''
space_regex="[[:space:]]+"
silent=false
web_status=false
############################################## args
OPTIONS="u:l:p:oysh"
LONG_OPTIONS="limit:,path:,orgName,yaml,silent,help,web"
PARSED_OPTIONS=$(getopt -o "$OPTIONS" --long "$LONG_OPTIONS" -- "$@")

if [ $? -ne 0 ]; then
    echo "Error: Invalid option"
    exit 1
fi

eval set -- "$PARSED_OPTIONS"

while true; do
    case "$1" in
        -u)
            target=$2
            shift 2
            ;;
        -l|--limit)
            limit=$2
            shift 2
            ;;
        -p|--path)
            path=$2
            shift 2
            ;;
        -o|--orgName)
            org_flag=true
            shift
            ;;
        -y|--yaml)
            sub_flag=false
            shift
            ;;
        --web)
            web_status=true
            shift
            ;;
        -s|--silent)
            silent=true
            shift
            ;;
        -h|--help)
            print_help
            exit 0
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Error: Invalid option"
            exit 1
            ;;
    esac
done


last_offset_file="last_offset-$target.txt"

if [ -z "$target" ]; then
    echo "Missing target argument."
    print_help
    exit 1
fi

if [ "$silent" = false ];then
    url="https://api.github.com/repos/atxiii/small-tools-for-hunters"
    response=$(curl -s "$url")
    last_updated_date=$(echo "$response" | grep -E '"updated_at":' | awk -F'"' '{print $4}')
    human_readable=$(date -d "$last_updated_date" +"%B %d, %Y %H:%M:%S")
    echo " _____________________________________________">&2
    echo "|
    |  ·▄▄▄▄  ▄• ▄▌• ▌ ▄ ·.  ▄▄▄· ▄▄· ▄▄▄  ▄▄▄▄▄
    |  ██▪ ██ █▪██▌·██ ▐███▪▐█ ▄█▐█ ▌▪▀▄ █·•██
    |  ▐█· ▐█▌█▌▐█▌▐█ ▌▐▌▐█· ██▀·██ ▄▄▐▀▀▄  ▐█.▪
    |  ██. ██ ▐█▄█▌██ ██▌▐█▌▐█▪·•▐███▌▐█•█▌ ▐█▌·
    |  ▀▀▀▀▀•  ▀▀▀ ▀▀  █▪▀▀▀.▀   ·▀▀▀ .▀  ▀ ▀▀▀ ">&2
    echo "|  Last Updated: $human_readable"
    echo "|">&2
    echo "|">&2



    [[ "$web_status" = false ]] && echo -e "| Target: ${GREEN}$target${NC}">&2
    [[ "$web_status" = false ]] && echo -e "| Limit: ${GREEN}$limit${NC}">&2
fi

file="$PWD/$target-crtsh.lst"

if [ "$org_flag" = true ]; then
    [[ "$silent" = false ]] && echo -e  "Flag: ${GREEN} organizationName${NC}"
    file="$PWD/$target-org-crtsh.lst"
fi

if [ "$silent" = false ];then
    # echo -e "File Path: ${GREEN}$file${NC}"
    echo -e "|                                          \🐱/                  ">&2
    echo -e "|__________________________________________\||/__________________">&2
fi

############################################## Calc Count of data

############################################## Web

if [ "$web_status" = true ];then

    if [ "$org_flag" = true ];then
        query="O"
    else
        query="q"
    fi

    if [[ -n "$path" ]]; then
        { while true; do
        output=$(curl -s -G  "https://crt.sh/?output=json" --data-urlencode "$query=$target")

        if echo "$output" | jq . >/dev/null 2>&1; then
            echo "$output" | jq -r '.[] | "\(.name_value)\n\(.common_name)"' | sed 's/\*.//g' | grep -Eo '^([a-zA-Z]+://)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$' | sort -u >&1
            break
        else
            echo "Fucking busy site. Retrying..." >&2
            sleep 1
        fi
        done
        exit 0
        } > $path
    else
        while true; do
        output=$(curl -s -G  "https://crt.sh/?output=json" --data-urlencode "$query=$target")
        if echo "$output" | jq . >/dev/null 2>&1; then
            echo "$output" | jq -r '.[] | "\(.name_value)\n\(.common_name)"' | sed 's/\*.//g' | grep -Eo '^([a-zA-Z]+://)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$' | sort -u >&1
            break
        else
            echo "Fucking busy site, Retrying in 1 seconds..." >&2
            sleep 1
        fi
        done
        exit 0
    fi
fi
while [ "$retries" -lt "$MAX_RETRIES_count" ] && [ "$count" -eq 0 ] ; do
    [[ "$count" -eq 0 ]] && retries=$((retries + 1))
    if [ "$silent" = false ];then
    loading_animation &
    loading_animation_pid=$!
    fi

    count_query=$(cat <<-END
        SELECT COUNT(*)
        FROM certificate_and_identities cai
        WHERE plainto_tsquery('certwatch', '$target') @@ identities(cai.CERTIFICATE)
            $([[ "$target" =~ $space_regex ]] && echo "AND plainto_tsquery('certwatch', '$target') @@ to_tsvector('certwatch', cai.NAME_VALUE)" || echo "AND cai.NAME_VALUE ILIKE ('%' || '$target' || '%')")
            $( [ "$org_flag" = true ] && echo "AND cai.NAME_TYPE = '2.5.4.10'" );
    END
    )

    count=$(echo "$count_query" | psql -t -h crt.sh -p 5432 -U guest certwatch)

    if [ -z "$count" ]; then
        echo " Error: Count of records is empty." >&2
        [[ "$silent" = false ]] && kill "$loading_animation_pid"
        exit 1
    fi

    sleep 1

    if [[ "$output" == *"timeout"* ]] || [[ "$output" == *"canceling statement due to statement"* ]] || [[ "$output" == *"canceling statement due to conflict"* ]] || [[ "$output" == *"SSL connection has"* ]] ; then
        [[ "$silent" = false ]] && echo -e "[-] ${RED}Connection timeout occurred. Retrying..${NC}" >&2
        retries=$((retries + 1))
        sleep "$RETRY_DELAY"
    else
        [[ "$silent" = false ]] && kill "$loading_animation_pid"
        [[ "$silent" = false ]] && echo -e " Total records: ${GREEN}$count${NC}" >&2
        [[ "$silent" = false ]] && echo -e "" >&2
    fi

done

if [ "$count" -eq 0 ];then
  echo "No records found!" >&2
  exit 0
fi
###############################################

exec_sql() {
    success=false

    # Check if the last offset file exists and retrieve the offset value
    if [ -f "$last_offset_file" ]; then
        offset=$(cat "$last_offset_file")
    fi


    while [ "$retries" -lt "$MAX_RETRIES" ] && [ "$success" = false ]; do

        query=$(cat <<-END
            WITH ci AS (
                SELECT
                    min(sub.CERTIFICATE_ID) ID,
                    min(sub.ISSUER_CA_ID) ISSUER_CA_ID,
                    array_agg(DISTINCT sub.NAME_VALUE) NAME_VALUES,
                    x509_commonName(sub.CERTIFICATE) COMMON_NAME,
                    x509_notBefore(sub.CERTIFICATE) NOT_BEFORE,
                    x509_notAfter(sub.CERTIFICATE) NOT_AFTER,
                    encode(x509_serialNumber(sub.CERTIFICATE), 'hex') SERIAL_NUMBER
                FROM (
                    SELECT *
                    FROM certificate_and_identities cai
                    WHERE plainto_tsquery('certwatch', '$target') @@ identities(cai.CERTIFICATE)
                         $([[ "$target" =~ $space_regex ]] && echo "AND plainto_tsquery('certwatch', '$target') @@ to_tsvector('certwatch', cai.NAME_VALUE)" || echo "AND cai.NAME_VALUE ILIKE ('%' || '$target' || '%')")
                        $( [ "$org_flag" = true ] && echo "AND cai.NAME_TYPE = '2.5.4.10'" )
                    LIMIT $limit OFFSET $offset
                ) sub
                GROUP BY sub.CERTIFICATE
            )
            SELECT
                ci.ISSUER_CA_ID,
                ca.NAME ISSUER_NAME,
                ci.COMMON_NAME,
                array_to_string(ci.NAME_VALUES, chr(10)) NAME_VALUE,
                ci.ID ID,
                le.ENTRY_TIMESTAMP,
                ci.NOT_BEFORE,
                ci.NOT_AFTER,
                ci.SERIAL_NUMBER,
                $count AS total_records
            FROM ci
            LEFT JOIN LATERAL (
                SELECT min(ctle.ENTRY_TIMESTAMP) ENTRY_TIMESTAMP
                FROM ct_log_entry ctle
                WHERE ctle.CERTIFICATE_ID = ci.ID
            ) le ON TRUE,
            ca
            WHERE ci.ISSUER_CA_ID = ca.ID
            ORDER BY le.ENTRY_TIMESTAMP DESC NULLS LAST;
							END
        )
        output=$(echo "$query" | psql -t -h crt.sh -p 5432 -U guest certwatch 2>&1)
        if [[ "$output" == *"timeout"* ]] || [[ "$output" == *"canceling statement due to"* ]] || [[ "$output" == *"SSL connection has"* ]] || [[ "$output" == *"client_idle_timeout"* ]]; then
            retries=$((retries + 1))
            sleep "$RETRY_DELAY"
        else
            success=true
        fi
    done

    if [ "$success" = true ]; then

        if [ "$silent" = false ];then
         # Calculate progress percentage
         total_records="$count"
         fetched_records="$((offset + limit))"
         progress=$(awk "BEGIN { pc=100*${fetched_records}/${total_records}; i=int(pc); print (pc>100)?100:((pc-i<0.5)?i:i+1) }")
         progress_row="Progress: $progress% || File Size: $(stat -c%s "$file")"

         # Print progress row
         tput cuu1 && tput el
         echo "$progress_row" >&2
         echo "-------------------------------" >&2
        fi

        if [ -f "$file" ] && [ -f "$last_offset_file" ]; then
            echo "$output" >> "$file"
        else
            echo "$output" > "$file"
        fi
        num_records=$((count - offset))
        if [ "$num_records" -ge "$limit" ]; then
            offset=$((offset + limit))
            echo "$offset" > "$last_offset_file"
            exec_sql "$target" "$flag"  "$count" "$file"
        else
            # Remove the last offset file if all records have been fetched
            rm -f "$last_offset_file"
           [[ "$silent" = false ]] && echo -e "$GREEN[🐱] Finish $NC" >&2

        fi
    else
        echo -e "$RED[-] Max retries reached. Failed to execute the command.$NC"
    fi
}

exec_sql  "$target" "$flag" "$count" "$file"

echo "=========="
echo "path:$path"

if [[ -n "$path" ]]; then
{
  [[ "$sub_flag" = false ]] && echo "data:"
  while IFS='|' read -r issuer_ca_id issuer_name common_name name_values id entry_timestamp not_before not_after serial_number dummy; do

      common_name=$(echo "$common_name" | xxd -p | sed 's/2b0a//g;s/20//g;s/2a2e//g;s/0a//gm' | xxd -r -p | tr -d '\n' )
      name_values=$(echo "$name_values" | xxd -p | sed 's/2b0a//g;s/20//g;s/2a2e//g;s/0a//gm' | xxd -r -p | tr -d '\n' )
      issuer_ca_id=$(echo "$issuer_ca_id" | sed -e 's/:{0}\s*\s{2}//g')
      id=$(echo "$id" | sed -e 's/:{0}\s*\s{2}//g')
      issuer_ca_id=$(echo "$issuer_ca_id" | sed -e 's/:{0}\s*\s{2}//g')
      serial_number=$(echo "$serial_number" | sed -e 's/:{0}\s*\s{2}//g')
      not_before=$(echo "$not_before" | sed -e 's/:{0}\s*\s{2}//g')
      not_after=$(echo "$not_after" | sed -e 's/:{0}\s*\s{2}//g')

      if [ "$sub_flag" = false ]; then
        echo "  - Issuer CA ID: $issuer_ca_id"
        echo "    Issuer Name: $issuer_name"
        echo "    Common Name: $common_name"
        echo "    Name Values: $name_values"
        echo "    ID: $id"
        echo "    Entry Timestamp: $entry_timestamp"
        echo "    Not Before: $not_before"
        echo "    Not After: $not_after"
        echo "    Serial Number: $serial_number"
      else
        echo "$common_name"
        echo "$name_values"
      fi
  done < "$file"
  } > "$path"
  [[ -n "$path" ]] && [[ "$sub_flag" = false ]] && [[ "$silent" = false ]] && echo "YAML file generated: $path"
else
   [[ "$sub_flag" = false ]] && echo "data:"
   while IFS='|' read -r issuer_ca_id issuer_name common_name name_values id entry_timestamp not_before not_after serial_number dummy; do
       common_name=$(echo "$common_name" | xxd -p | sed 's/2b0a//g;s/20//g;s/2a2e//g;s/0a//gm' | xxd -r -p | sed '/^$/d;/+/d'  )
       name_values=$(echo "$name_values" | xxd -p | sed 's/2b0a//g;s/20//g;s/2a2e//g;s/0a//gm' | xxd -r -p | sed '/^$/d;/+/d'  )
       issuer_ca_id=$(echo "$issuer_ca_id" | sed -e 's/:{0}\s*\s{2}//g' | sed '/^$/d;/+/d' )
       id=$(echo "$id" | sed -e 's/:{0}\s*\s{2}//g'| sed '/^$/d;/+/d' | sed '/^$/d;/+/d'  )
       issuer_ca_id=$(echo "$issuer_ca_id" | sed -e 's/:{0}\s*\s{2}//g'| sed '/^$/d;/+/d' )
       serial_number=$(echo "$serial_number" | sed -e 's/:{0}\s*\s{2}//g'| sed '/^$/d;/+/d' )
       not_before=$(echo "$not_before" | sed -e 's/:{0}\s*\s{2}//g'| sed '/^$/d;/+/d' )
       not_after=$(echo "$not_after" | sed -e 's/:{0}\s*\s{2}//g'| sed '/^$/d;/+/d' )

       if [ "$sub_flag" = false ]; then
         echo "  - Issuer CA ID: $issuer_ca_id"
         echo "    Issuer Name: $issuer_name"
         echo "    Common Name: $common_name"
         echo "    Name Values: $name_values"
         echo "    ID: $id"
         echo "    Entry Timestamp: $entry_timestamp"
         echo "    Not Before: $not_before"
         echo "    Not After: $not_after"
         echo "    Serial Number: $serial_number"
       else
           url_validator "$common_name" | sed '/^$/d'
           url_validator "$name_values" | sed '/^$/d'
       fi
   done < "$file"
fi

# remove temp file
[[ -z "$path" ]] && rm "$file"
