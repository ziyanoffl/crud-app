const express = require("express")
const fs = require("fs")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.json())

const dataFilePath = path.join(__dirname, "../data/items.json")

function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading data:", error)
    throw error
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing data:", error)
    throw error
  }
}

// Get all items
app.get("/api/items", (req, res) => {
  try {
    const items = readData()
    res.json(items)
  } catch (error) {
    res.status(500).send("Error fetching items")
  }
})

// Get item by ID
app.get("/api/items/:id", (req, res) => {
  try {
    const items = readData()
    const item = items.find((item) => item.id === req.params.id)
    if (item) {
      res.json(item)
    } else {
      res.status(404).send("Item not found")
    }
  } catch (error) {
    res.status(500).send("Error fetching item")
  }
})

// Create a new item
app.post("/api/items", (req, res) => {
  try {
    console.log("Request body:", req.body)
    const items = readData()
    const newItem = {
      id: Date.now().toString(),
      name: req.body.name,
      status: req.body.status,
    }
    items.push(newItem)
    writeData(items)
    res.status(201).json(newItem)
  } catch (error) {
    res.status(500).send("Error creating item")
  }
})

// Update an item
app.put("/api/items/:id", (req, res) => {
  try {
    const items = readData()
    const index = items.findIndex((item) => item.id === req.params.id)
    if (index !== -1) {
      items[index].name = req.body.name
      items[index].status = req.body.status
      writeData(items)
      res.json(items[index])
    } else {
      res.status(404).send("Item not found")
    }
  } catch (error) {
    res.status(500).send("Error updating item")
  }
})

// Delete an item
app.delete("/api/items/:id", (req, res) => {
  try {
    const items = readData()
    const newItems = items.filter((item) => item.id !== req.params.id)
    if (items.length !== newItems.length) {
      writeData(newItems)
      res.status(204).send()
    } else {
      res.status(404).send("Item not found")
    }
  } catch (error) {
    res.status(500).send("Error deleting item")
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "CRUD API",
      version: "1.0.0",
      description: "CRUD API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./server/index.js"],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *   post:
 *     summary: Create a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *   put:
 *     summary: Update an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not Found
 *   delete:
 *     summary: Delete an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not Found
 */

// Error Handling
app.get("/api/items", (req, res) => {
  try {
    const items = readData()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" })
  }
})

// Handle 404 errors for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal Server Error" })
})
