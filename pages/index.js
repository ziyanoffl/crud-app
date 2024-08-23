import { useState, useEffect } from "react"
import { Container, Button, TextField, Snackbar, Alert } from "@mui/material"
import axios from "axios"
import Link from "next/link"
import ItemTable from "../components/TableComponent"
import ConfirmDialog from "../components/DialogComponent"

export default function Home() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [searchQuery, items])

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/items")
      setItems(response.data)
    } catch (error) {
      setSnackbarMessage("Failed to fetch items.")
      setSnackbarOpen(true)
    }
  }

  const handleDelete = (id) => {
    setDeleteId(id)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/items/${deleteId}`)
      setSnackbarMessage("Item deleted successfully.")
      fetchItems()
    } catch (error) {
      setSnackbarMessage("Failed to delete item.")
    }
    setDialogOpen(false)
    setSnackbarOpen(true)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <Container>
      <h1>Items</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        margin="normal"
      />
      <Link href="/item/new" passHref>
        <Button variant="contained" color="primary">
          Add New Item
        </Button>
      </Link>
      <ItemTable items={filteredItems} onDelete={handleDelete} />
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this item?"
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}
