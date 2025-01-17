import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { LicenseInfo } from '@mui/x-license'

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_X_LICENSE_KEY);

import App from './App.tsx'

import '@fontsource/roboto/400.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)