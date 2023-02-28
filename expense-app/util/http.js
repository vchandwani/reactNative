import axios from 'axios';

const BACKEND_URL =
    'https://react-native-course-624d6-default-rtdb.firebaseio.com/';

export async function storeExpense(expenseData, auth) {
    const response = await axios.post(
        BACKEND_URL + 'expenses.json?' + auth,
        expenseData
    );
    const id = response.data.name;
    return id;
}

export async function fetchExpenses(auth, selectedBudgetId) {
    const response = await axios.get(BACKEND_URL + 'expenses.json?' + auth);
    const expenses = [];

    for (const key in response.data) {
        if (
            selectedBudgetId &&
            response.data[key].budgetId === selectedBudgetId
        ) {
            const expenseObj = {
                ...response.data[key],
                id: key,
                date: new Date(response.data[key].date),
            };
            expenses.push(expenseObj);
        }
    }
    return expenses;
}

export function updateExpense(id, expenseData, auth) {
    return axios.put(BACKEND_URL + `expenses/${id}.json?` + auth, expenseData);
}

export function deleteExpense(id, auth) {
    return axios.delete(BACKEND_URL + `expenses/${id}.json?` + auth);
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
