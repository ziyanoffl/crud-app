import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000", // Set the background color to black
    },
    text: {
      primary: "#ffffff", // Set the primary text color to white
    },
  },
})

export default theme
