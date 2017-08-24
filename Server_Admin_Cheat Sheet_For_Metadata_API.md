# Cheat Sheet For Metadata API

## Server IP: 162.xxx.xxx.94 (Digital Ocean Box)

## Source Files for API are located in /var/www/open-metadata-API

## Background
The metadata api is a node.js express app

## Accessing the Server
1. Log into the server via:
  `ssh user@162.xxx.xxx.94` (password is in passpack)
2. Assumes that ou are are a sudoer, so you can do everything


## Restarting the API/Express App
We are using pm2, a process manager for node.js to continuously run the express.js app. You can read more about pm2 here

1. Ssh into the box

2. Check to see if the API/express app is actually running. You will need to first switch to the pm2user to see if the app is running. PM2 saves data under user's '~/.pm2' folder, so other users can not see your PM2 process with 'pm2 status'.  (see this stackoverflow for more explaination, here)
  `$ sudo su pm2user`
  `$ pm2 list`
  Or this also works: `$pm2 status metadata_api_app`

3. Restart the the API/ express app (You will need to run commands as the pm2 user):
  - switch to the pm2user: `sudo su pm2user`
  - Restart app: `$pm2 restart metadata_api_app `
  - To stop app, use: `$pm2 stop metadata_api_app `
  - To start app use: $pm2 stop metadata_api_app `

4. If all else fails and you can’t start or stop the API/express app, do the following:
  - Get the process number  for the express app:
    `$ps ax | grep node`
  - That would return something like:
    ``` ubuntu@datasf-apigateway:~$ ps ax | grep node
      4268 ?        Ssl    1:14 node /var/www/open-metadata-API/ metadata_api_app
      23712 pts/0    S+     0:00 grep node
    ```
  -Then, using the example above, run the command:
    `$  kill -9 pid processid`
    So from the example above it would be:
    `kill -9 4268`

## Deploy changes to the API via GIT
1. Ssh into the box
2. You will need to stop the express api by running the commands:
  1. Switch over to the pm2user: `sudo su pm2user`
  2. Stop the app as pm2user: `pm2 stop metadata_api_app`
3. Go to the directory:
  `cd /var/www/open-metadata-api`
4. Just do:
  ` git pull origin branchThatYouWantToPull`
5. Restart the express add, using the command `pm2 start metadata_api_app`
6. Switch back over to your user: `su yrusername`

## Restarting Nginx
1. Ssh into the box
2. For reference, the config file for the metadata config is in: `/etc/nginx/sites-available/metadatasf`
3. Make sure is nginx is running: `service nginx status`
4. Restart nginx: `service nginx restart`

