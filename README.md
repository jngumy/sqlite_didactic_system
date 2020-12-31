# SQLite Didactic system - TP Final Base de datos 2 - FIUNMDP

This project is related to Base de datos 2 final project. It's an SQL database playground for testing, debugging and record SQL snippets. Developed by Juan G. and Lucia G.
You can create your account and start playing with your test database and see your activity history. 
Also you can import an existing database file (sqlite) to work with existing schemas and databases
and export your database file.

Tools and frameworks used in this project:
* Node.js and Express for backend http server
* Ejs for templating engine
* Passport.js for authentication middleware
* SQLite for the db layer
* Sequelize ORM
* SQL.js for embebed database on the browser
* HTML5, CSS, JS for frontend
* Bootstrap for styling
* Docker

## Setup

Clone the repo and install the dependencies.

 ```
git clone https://github.com/jngumy/sqlite_didactic_system.git
cd sqlite_didactic_system
```
and install the dependencies

 ```
npm install
```

To start the server, run the following

 ```
npm run dev
```

## Setup with Docker

Clone the repo.

 ```
git clone https://github.com/jngumy/sqlite_didactic_system.git
cd sqlite_didactic_system
```

Build the image

 ```
docker build -t <your-custom-name>/node-web-app
```

Execute the image

 ```
docker run -p 5000:5000 -d <your-custom-name>/node-web-app
```
