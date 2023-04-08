const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const sqlite = require('sqlite3')
const app = express()
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())
const PATH = path.join(__dirname, 'Tasks.db')
const db = new sqlite.Database(PATH, sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.log(err);
    else {
        console.log('database has been created');
    }
})


app.post('/add', (req, res) => {
    try {
        const { title, description } = req.body
        db.run('INSERT INTO tasks (title, discription) VALUES (?, ?)', [title, description], (err) => {
            if (err) return console.log(err);
        });
        res.json({
            statusbar: 200,
            successful: true,
        })
    } catch (err) {
        console.log(err);
        res.json({
            statusbar: 500,
            successful: false,
        })
    }
})

app.get('/read', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.log(err)
            return res.json({
                statusbar: 500,
                successful: false
            })
        }

        else {
            console.log(rows)
            res.status(200).send(rows)
        }
    })
}
)

// Retrieving data of perticular row from database

app.get('/read/:id', (req, res) => {
    const id = req.params.id;
    db.all('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.log(err)
            res.json({
                statusbar: 500,
                successful: false
            })
        }

        else {
            if (row.length) {
                console.log("Data has retrieve")
                res.status(200).send(row)
            }
            else {
                console.log("Id is not defined")
                res.json({
                    statusbar: 500,
                    successful: false,
                })
            }

        }
    })
})

// Updating data of database from exising id
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body
    db.run('UPDATE tasks SET title = ?, discription = ? WHERE id = ?', [title, description, id], (err) => {
        if (err) {
            console.log(err)
            res.json({
                statusbar: 500,
                successful: false,
            })
        }
        else {
            res.json({
                statusbar: 200,
                successful: true,
            })
        }
    })
})

app.delete('/remove/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send("data has been deleted")
        }

    })
})
app.listen(3000, (err) => {
    if (err) return console.log(err);
    return console.log("It is successfully running")
})