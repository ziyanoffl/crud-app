import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "../styles/theme" // Import your custom theme

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This ensures consistent styling across browsers */}
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp