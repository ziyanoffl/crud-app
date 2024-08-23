const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

let items = [] // In-memory storage for items

app.get("/api/items", (req, res) => {
  res.json(items)
})

app.post("/api/items", (req, res) => {
  const newItem = { id: Date.now(), ...req.body }
  items.push(newItem)
  res.json(newItem)
})

app.put("/api/items/:id", (req, res) => {
  const { id } = req.params
  const index = items.findIndex((item) => item.id == id)
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body }
    res.json(items[index])
  } else {
    res.status(404).json({ error: "Item not found" })
  }
})

app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params
  items = items.filter((item) => item.id != id)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
