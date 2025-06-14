import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { AppProvider } from "../context/contexto.tsx";
import { ProductosProvider } from '../context/ProductosContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <ProductosProvider>
        <App />
      </ProductosProvider>
    </AppProvider>
  </StrictMode>
)
