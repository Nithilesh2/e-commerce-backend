// const express = require("express")
// const sqlite3 = require("sqlite3").verbose()
// const cors = require("cors")

// const app = express()
// const port = 7000

// app.use(cors())
// app.use(express.json())

// const db = new sqlite3.Database("./users.db")

// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       email TEXT,
//       password TEXT
//     )
//   `)
// })

// app.post("/login", (req, res) => {
//   const { emailOrPhone, password } = req.body

//   if (!emailOrPhone || !password) {
//     return res.status(400).json({ error: "Email or password missing" })
//   }
//   if (emailOrPhone === "9866201028" && password === "password") {
//     res.status(200).json({ message: "Login successful!" })
//   } else {
//     res.status(401).json({ error: "Invalid credentials" })
//   }
// })
// app.post("/signup", (req, res) => {
//   const { name, emailOrPhone, password } = req.body

//   if (!name || !emailOrPhone || !password) {
//     return res
//       .status(400)
//       .json({ error: "Name, email/phone, and password are required" })
//   }

//   db.run(
//     "INSERT INTO users (name, emailOrPhone, password) VALUES (?, ?, ?)",
//     [name, emailOrPhone, password],
//     function (err) {
//       if (err) {
//         return res.status(500).json({ error: err.message })
//       }
//       res.status(201).json({ message: "User signed up successfully" })
//     }
//   )
// })

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`)
// })
const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")

const app = express()
const port = 7000

app.use(cors())
app.use(express.json())

// const db = new sqlite3.Database("./user.db", (err) => {
//   if (err) {
//     console.error("Error opening database:", err.message)
//   } else {
//     console.log("Connected to the SQLite database.")
//     db.serialize(() => {
//       db.run(`DROP TABLE IF EXISTS users`, (err) => {
//         if (err) {
//           console.error("Error dropping table:", err.message)
//         } else {
//           console.log("Dropped existing users table.")
//           db.run(
//             `
//             CREATE TABLE IF NOT EXISTS users (
//               id INTEGER PRIMARY KEY AUTOINCREMENT,
//               name TEXT,
//               emailOrPhone TEXT,
//               password TEXT
//             )
//           `,
//             (err) => {
//               if (err) {
//                 console.error("Error creating table:", err.message)
//               } else {
//                 console.log("Users table created.")
//               }
//             }
//           )
//         }
//       })
//     })
//   }
// })
const db = new sqlite3.Database("./user.db", (err) => {
  if (err) return console.error("Error opening database:", err.message)

  console.log("Connected to the SQLite database.")

  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS users`, (err) => {
      if (err) return console.error("Error dropping table:", err.message)

      console.log("Dropped existing users table.")

      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          emailOrPhone TEXT,
          password TEXT
        )`,
        (err) => {
          if (err) return console.error("Error creating table:", err.message)

          console.log("Users table created.")
        }
      )
    })
  })
})

app.post("/login", (req, res) => {
  const { emailOrPhone, password } = req.body

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ error: "Email/phone and password are required" })
  }
  db.get(
    "SELECT * FROM users WHERE emailOrPhone = ? AND password = ?",
    [emailOrPhone, password],
    (err, row) => {
      if (err) {
        console.error("Error fetching user:", err.message)
        return res.status(500).json({ error: "Failed to fetch user" })
      }
      if (row) {
        res.status(200).json({ message: "Login successful!" })
      } else {
        res.status(401).json({ error: "Invalid credentials" })
      }
    }
  )
})
app.post("/signup", (req, res) => {
  const { name, emailOrPhone, password } = req.body

  if (!name || !emailOrPhone || !password) {
    console.log("Invalid input:", req.body)
    return res
      .status(400)
      .json({ error: "Name, email/phone, and password are required" })
  }

  db.run(
    "INSERT INTO users (name, emailOrPhone, password) VALUES (?, ?, ?)",
    [name, emailOrPhone, password],
    function (err) {
      if (err) {
        console.error("Error inserting user:", err.message)
        return res.status(500).json({ error: err.message })
      }
      console.log(`User ${name} signed up successfully with ID ${this.lastID}`)
      res.status(201).json({ message: "User signed up successfully" })
    }
  )
})
app.get("/signup", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ users: rows })
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
