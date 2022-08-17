import axios from "axios";

const API_KEY = "AIzaSyB6GS0HtMuORmUd7vQCnAelAG1CrqOG46c";
const BACKEND_URL = "https://identitytoolkit.googleapis.com/v1/accounts:";

async function authenticate(mode, email, password) {
  const url = BACKEND_URL + `${mode}?key=` + API_KEY;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
}
export async function createUser(email, password) {
  await authenticate("signUp", email, password);
}
export async function login(email, password) {
  await authenticate("signIn", email, password);
}
