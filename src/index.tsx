import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/authConfig";
import App from "./App";

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(msalConfig);

// Wrap your app component tree in the MsalProvider component
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <MsalProvider instance={publicClientApplication}>
    <App />
  </MsalProvider>
);
