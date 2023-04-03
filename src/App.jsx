import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { useEffect, useState } from "react";
import { loginRequest } from "./auth/authConfig";

function signInClickHandler(instance) {
  instance.loginRedirect();
}

// SignInButton Component returns a button that invokes a popup login when clicked
function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return <button onClick={() => signInClickHandler(instance)}>Sign In</button>;
}

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const [data, setData] = useState("");

  if (isAuthenticated) {
    instance.acquireTokenSilent(loginRequest).then((response) => {
      console.log("reponse token", response.accessToken);
      // Call your API with the access token and return the data you need to save in state
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${response.accessToken}`);
      fetch(
        "https://capgeminidcxnl.api.crm4.dynamics.com/api/data/v9.2/contacts?$select=fullname",
        {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        }
      )
        .then((response) => response.json())
        .then((result) => setData(result))
        .catch((error) => console.log("error", error));
      console.log("fetched data", data);
    });
  }
  return (
    <>
      <AuthenticatedTemplate>
        <p>This will only render if a user is signed-in.</p>
        <WelcomeUser />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>This will only render if a user is not signed-in.</p>
        <SignInButton />
      </UnauthenticatedTemplate>
    </>
  );
}
export default App;
