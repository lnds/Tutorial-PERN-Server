// index.js
const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")

const PORT = process.env.SERVER_PORT

//middleware
app.use(cors())
app.use(express.json())

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query(
            "INSERT INTO todos(description) VALUES($1) RETURNING *",
            [description]
        )
        res.json(newTodo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query(
            "SELECT * FROM todos"
        )
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(PORT, () => {
	console.log("servidor iniciado en puerto " + PORT)
})
