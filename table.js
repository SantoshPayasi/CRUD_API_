const path  = require('path')
const sqlite = require('sqlite3').verbose();

const PATH = path.join(__dirname, 'Tasks.db')
// console.log(PATH)
const db = new sqlite.Database(PATH, sqlite.OPEN_READWRITE, (err)=>{
    if(err) return console.log(err);
    else{
        console.log('database has been created');
    }
})
const sql = `CREATE TABLE tasks(ID INTEGER PRIMARY KEY, title, discription)`;
db.run(sql)