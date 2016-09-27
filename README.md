Smart pinger can response error about a server is down not immediately after single HTTP ping returned error, but after series of failures in configured period!

Smart pinger is a daemon, which do ping of servers from time to time and display all results on the status page.

## Algorithm

Current algorithm is fully passive: client should do HTTP request to the status page to take acknowledge about a server is down.

### Pinger daemon

1. Read configuration to check from disk: path -> valid config
2. Setup ping scheduler: config -> scheduler
    1. Do ping (HTTP/OS) of an URL/host: task config -> result
    2. Add result to history of the URL/host: result -> history

### Status page

1. Check history for failure state of all tasks: dbPath -> failure events array
2. Display status table: failure events -> string
