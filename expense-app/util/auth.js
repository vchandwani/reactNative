import axios from 'axios';

const API_KEY = 'AIzaSyB6GS0HtMuORmUd7vQCnAelAG1CrqOG46c';
const BACKEND_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';

async function authenticate(mode, email, password) {
    const url = BACKEND_URL + `${mode}?key=` + API_KEY;
    const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true,
    });

    const userData = response.data;
    return { token: userData.idToken, email: userData.email };
}
export function createUser(email, password) {
    return authenticate('signUp', email, password);
}
export function login(email, password) {
    return authenticate('signInWithPassword', email, password);
}
