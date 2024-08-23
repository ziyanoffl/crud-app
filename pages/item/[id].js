import { useRouter } from "next/router"
import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios"
import ItemForm from "../../components/FormComponent"

export default function ItemPage() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState({ name: "" })

  useEffect(() => {
    if (id && id !== "new") {
      fetchItem()
    }
  }, [id])

  const fetchItem = async () => {
    const response = await axios.get(`http://localhost:3001/api/items`)
    const foundItem = response.data.find((item) => item.id == id)
    if (foundItem) setItem(foundItem)
  }

  const handleSubmit = async (formData) => {
    if (id === "new") {
      await axios.post("http://localhost:3001/api/items", formData)
    } else {
      await axios.put(`http://localhost:3001/api/items/${id}`, formData)
    }
    router.push("/")
  }

  return (
    <Container>
      <h1>{id === "new" ? "Create Item" : "Edit Item"}</h1>
      <ItemForm initialData={item} onSubmit={handleSubmit} />
    </Container>
  )
}
