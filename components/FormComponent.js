import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { useState, useEffect } from "react"

export default function ItemForm({
  initialData = { name: "", status: "IN STOCK" },
  onSubmit,
}) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting form data:", formData) // Debugging line
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
      <FormControl fullWidth required margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          name="status"
          value={formData.status || ""}
          onChange={handleChange}
        >
          <MenuItem value="IN STOCK">IN STOCK</MenuItem>
          <MenuItem value="OUT OF STOCK">OUT OF STOCK</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {initialData.id ? "Update" : "Create"}
      </Button>
    </form>
  )
}
