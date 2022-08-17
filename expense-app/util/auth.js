import axios from "axios";

const API_KEY = "AIzaSyB6GS0HtMuORmUd7vQCnAelAG1CrqOG46c";
const BACKEND_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

export async function createUser(email, password) {
  const response = await axios.post(BACKEND_URL + API_KEY, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
}
