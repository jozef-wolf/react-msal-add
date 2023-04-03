import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { useEffect, useState } from "react";

// SignInButton Component returns a button that invokes a popup login when clicked
function PageLayout() {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState<any>();
  const isAuthenticated = useIsAuthenticated();
  const username = accounts[0].username;

  const tokenRequest = {
    account: accounts[0],
    scopes: ["https://capgeminidcxnl.crm4.dynamics.com/user_impersonation"],
  };

  useEffect(() => {
    if (isAuthenticated) {
      instance.acquireTokenSilent(tokenRequest).then((response) => {
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
          .then((result) => setData(result.value))
          .catch((error) => console.log("error", error));
      });
    }
  }, [isAuthenticated]);

  return (
    <>
      <p>Welcome, {username}</p>
      {data ? (
        data.map((contact: any, id: any) => {
          return <div key={id}>{contact.fullname}</div>;
        })
      ) : (
        <div>pelease wait...</div>
      )}
    </>
  );
}

export default PageLayout;
