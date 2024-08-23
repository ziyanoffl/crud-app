import { TextField, Button } from "@mui/material"
import { useState, useEffect } from "react"

export default function ItemForm({ initialData = { name: "" }, onSubmit }) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        {initialData.id ? "Update" : "Create"}
      </Button>
    </form>
  )
}
