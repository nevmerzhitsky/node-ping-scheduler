Smart pinger can response error about a server is down not immediately after single HTTP ping returned error, but after series of failures in configured period!

Smart pinger is a daemon, which do ping of servers from time to time and display all results on the status page.

Algorithm:

1. Read configuration to check from disk: path -> valid config
2. Setup ping scheduler: config -> scheduler
    1. Do ping (HTTP/OS) of an URL/host: task config -> result
    2. Add result to history of the URL/host: result -> history
    3. Check history in failure state: config, history -> failure event/null
    4. Update status table: failure -> null
