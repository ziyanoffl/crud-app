import { useRouter } from "next/router"
import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios"
import ItemForm from "../../components/FormComponent"

export default function ItemPage() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState({ name: "", status: "IN STOCK" }) // Initialize with status

  useEffect(() => {
    console.log("Current ID:", id) // Debugging line
    if (id && id !== "new") {
      fetchItem()
    }
  }, [id])

  const fetchItem = async () => {
    try {
      const response = await axios.get(`https://crud-app-3bsz.onrender.com/api/items/${id}`) // Fetch item by ID
      console.log("Fetched item:", response.data) // Debugging line
      setItem(response.data)
    } catch (error) {
      console.error("Failed to fetch item:", error)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting form data:", formData) // Debugging line
      if (id === "new") {
        await axios.post("https://crud-app-3bsz.onrender.com/api/items", formData)
      } else {
        console.log("Sending data for update:", formData) // Debugging line
        await axios.put(`https://crud-app-3bsz.onrender.com/api/items/${id}`, formData)
      }
      router.push("/")
    } catch (error) {
      console.error("Failed to save item:", error)
    }
  }

  return (
    <Container>
      <h1>{id === "new" ? "Create Item" : "Edit Item"}</h1>
      <ItemForm initialData={item} onSubmit={handleSubmit} />
    </Container>
  )
}
