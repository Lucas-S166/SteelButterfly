import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { ClimateImpactProvider } from "./context/ClimateImpactContext.jsx";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <ClimateImpactProvider>
      <App />
    </ClimateImpactProvider>
  </ThemeProvider>
)
