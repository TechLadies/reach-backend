# NodeJS Backend Starter Kit

## Post-Forking Steps

1. Update `db/config.json` with the correct database names for Development and Test databases.

## Initial setup steps for local development

2. Copy `env.sample` to `.env`
3. Prepare the databases

	```
	NODE_ENV=development npm run db:create
	NODE_ENV=development npm run db:migrate
	NODE_ENV=test npm run db:create
	NODE_ENV=test npm run db:migrate
	```

4. Prepare the seed data for development

	```
	NODE_ENV=development npm run db:seed
	```

5. You can update the content of `public/index.html`

## Windows Users

Some things to note: 

- Use "Git bash" to run the commands above.
- After copying `.env` file, open it up and update the `DB_USER` and `DB_PASSWORD` to what you have set for your Postgres root user in Windows.


## Setting up PostgreSQL for Windows Users

1. Remove all previous postgresql users/accounts , if uninstalled pg delete all undeleted folders and restart computer
To install: 
2. Right click on installer, run as admin 
3. Create a separate folder for data directory. ** data directory must be different form app directory 
4. Go to command prompt and try to start server
e.g.  
"C:\Program Files\PostgreSQL\12\bin\pg_ctl" -D "C:\Program Files\PostgreSQL\11\data" start
(postgresql app directory )                       (data directory)     

5. For first time installation this will be prompt--> set superuser as postgres:
e.g.
"C:\Program Files\PostgreSQL\12\bin\initdb" -U postgres -D "C:\Postgres data" 
 (postgresql app directory)                                 (data directory)
 
6. Command to start server will be generated in command prompt after step 5. 

It should look like this: 
e.g. 
  ^"C^:^/Program^ Files^/PostgreSQL^/12^/bin^/pg^_ctl^" -D ^"C^:^\Postgres^ data^" -l logfile start

7. Copy and paste to start server

## Installing bcrypt for Windows Users

1. Right click on Windows button and run Powershell(admin) command prompt 
Run the following commands 
2.  npm install --global --production windows-build-tools
3. Restart computer
4. npm install node-gyp
5. npm install bcrypt

or

1. npm install bcryptjs 

