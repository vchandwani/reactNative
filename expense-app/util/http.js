import axios from 'axios';

const BACKEND_URL =
    'https://react-native-course-624d6-default-rtdb.firebaseio.com/';

export async function storeExpense(budgetId, expenseData, auth, month, year) {
    const response = await axios.post(
        BACKEND_URL +
            `budget/${budgetId}/expenses/${year}/${month}.json?` +
            auth,
        expenseData
    );

    const id = response.data.name;
    return id;
}

export function updateExpense(budgetId, id, expenseData, auth, month, year) {
    return axios.put(
        BACKEND_URL +
            `budget/${budgetId}/expenses/${year}/${month}/${id}.json?` +
            auth,
        expenseData
    );
}

export function deleteExpense(budgetId, id, auth, month, year) {
    return axios.delete(
        BACKEND_URL +
            `budget/${budgetId}/expenses/${year}/${month}/${id}.json?` +
            auth
    );
}

export async function fetchBudget(auth) {
    const response = await axios.get(BACKEND_URL + 'budget.json?' + auth);

    return response.data;
}

export async function storeBudgetEntry(budgetId, entryData, auth) {
    const response = await axios.post(
        BACKEND_URL + `budget/${budgetId}/entries.json?` + auth,
        entryData
    );
    const id = response.data.name;
    return id;
}
export function updateBudgetEntry(id, entryData, budgetId, auth) {
    return axios.put(
        BACKEND_URL + `budget/${budgetId}/entries/${id}.json?` + auth,
        entryData
    );
}

export function deleteBudgetEntry(id, budgetId, auth) {
    return axios.delete(
        BACKEND_URL + `budget/${budgetId}/entries/${id}.json?` + auth
    );
}
