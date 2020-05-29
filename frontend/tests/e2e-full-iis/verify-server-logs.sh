#!/usr/bin/env bash

set -e

cd $1

failures=0

for logFile in *; do
    echo "verifying file: $logFile"

    if [[ $(cat $logFile | grep "Client error" | wc -l) -eq 0 ]]; then
        echo "    no log entry for client error"
        ((failures++))
    fi

    if [[ $(cat $logFile | grep "Application is shutting down" | wc -l) -eq 0 ]]; then
        echo "    no log entry for shutting down"
        ((failures++))
    fi

    echo "$logFile verfifyed"
    echo ""
done

if [[ $failures == 0 ]]; then
    echo "log check OK"
else
    exit 1
fi
