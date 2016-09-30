Smart pinger can response error about a server is down not immediately after single HTTP ping returned error, but after series of failures in configured period!

Smart pinger is a daemon, which do ping of servers from time to time and display all results on the status page. You can configure New Relic to check this page periodically.

## Installation

The app tested on Ubuntu 14.04. On Ubuntu 12 you get issue with installing `raw-socket` nodejs package.

1. Create a user for run the app: `adduser pinger`, login by it
2. [Optional] Add your SSH keys to `~/.ssh/authorized_keys`
3. Install [Node Version Manager](https://github.com/creationix/nvm)
4. Switch to the last node version (tested for v6.2+): `nvm install node`
5. Checkout the app: `git clone https://github.com/nevmerzhitsky/node-smart-pinger`
6. Go to `node-smart-pinger` dir and run `npm install`
    * On Windows you maybe need specify MS Visual Studio version (and install it before): `npm install --msvs_version=2013`. This required only to compile `raw-socket` package.
7. Rename `config.example.json` to `config.json` and change `port` in `webServer` section, setup tasks to ping
8. Test app work and config is correct by `npm test`, the type `npm run start-test` and open in a browser http://your-domain:your-port
9. Kill currect app process and run `npm run start-daemon`, check the browser again
10. Add call to `npm run start-daemon` by the `pinger` user to autostart of your OS

### Ubuntu autorun

If you use nvm on Ubuntu then use this method. By the `pinger` user create `pinger_start.sh` script in the home directory:

```bash
#!/bin/bash

cd /home/pinger/node-smart-pinger
export NVM_DIR="/home/pinger/.nvm"
source $NVM_DIR/nvm.sh
npm run start-daemon
```

And add it by `root` user to the `/etc/rc.local` before last exit:

```sh
sudo -i -u oneundone /home/pinger/pinger_start.sh
```

## Configuration

By default app read config.json from the root of project. You can change path to config by env var `SMARTPINGER_CONFIG`. Value should be relative path from the `src` dir of app.

### Restarting app

After change the config you should restart the daemon:

1. Go to `node-smart-pinger` dir
2. Type `pm2 gracefulReload daemon` if pm2 package is installed globally (`npm install pm2 -g`)
3. Or `pm2 kill` or `ps aux | grep ping` + `kill ...` then `npm run start-daemon`

## App algorithm

Current algorithm is fully passive: client should do HTTP request to the status page to take acknowledge about a server is down.

### Pinger daemon

1. Read configuration to check from disk: path -> valid config
2. Setup ping scheduler: config -> scheduler
    1. Do ping (HTTP/OS) of an URL/host: task config -> result
    2. Add result to history of the URL/host: result -> history

### Status page

1. Check history for failure state of all tasks: dbPath -> failure events array
2. Display status table: failure events -> string
