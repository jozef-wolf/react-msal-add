
import { useMsal } from "@azure/msal-react";

export const SignOutButton = () => {
    const { instance } = useMsal();
    
    const handleLogout = (logoutType: any) => {
        if (logoutType === "redirect") {
           instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }
    return (
        <button onClick={() => handleLogout("redirect")}>Sign out using Redirect</button>
    );
}