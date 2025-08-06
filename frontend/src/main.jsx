import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';



createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-eiqbf3dufeploub7.us.auth0.com"
    clientId="fIIXOxWwmSkOM3N6vrX7Qvt2G88hCbSo"
    authorizationParams={{
      redirect_uri: window.location.origin + "/dashboard"
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
)

