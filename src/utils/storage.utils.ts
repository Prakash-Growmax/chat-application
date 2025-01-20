import { AccessToken_LocalKey } from "@/constants/storage.constant";

const storedToken = localStorage.getItem(AccessToken_LocalKey);

let token;
if (storedToken) {
 
  try {
    const parsedToken = JSON.parse(storedToken);
    token = parsedToken?.access_token || null;
  } catch (error) {
    console.error("Error parsing token:", error);
    token = null;
  }
} else {

  token = null;
}
export {token}