//File to hold information about the SQLlite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, committee1 TEXT, committee2 TEXT, committee3 TEXT)");
    db.run("CREATE TABLE committee (name TEXT UNIQUE PRIMARY KEY, creater TEXT, chair TEXT, member1 TEXT, member2 TEXT, member3 TEXT, member4 TEXT, member5 TEXT, member6 TEXT, observer1 TEXT, observer2 TEXT, observer3 TEXT, currentMotionID INT)");
    db.run("CREATE TABLE motion(id INT PRIMARY KEY, name TEXT, description TEXT, committee TEXT, for INT, against INT, status INT, discussionFile TEXT)");
    db.run("CREATE TABLE status(id INT PRIMARY KEY, status TEXT)");
});

module.exports = db;