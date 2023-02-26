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

export async function fetchExpenses(auth, email) {
    const response = await axios.get(BACKEND_URL + 'expenses.json?' + auth);
    const expenses = [];

    for (const key in response.data) {
        if (email && response.data[key].email === email) {
            const expenseObj = {
                id: key,
                amount: response.data[key].amount,
                date: new Date(response.data[key].date),
                description: response.data[key].description,
                email: response.data[key].email,
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

export async function fetchBudget(auth, email) {
    const response = await axios.get(BACKEND_URL + 'budget.json?' + auth);
    const budget = [];

    for (const key in response.data) {
        if (email && response.data[key].users.includes(email)) {
            const budgetObj = {
                id: key,
                entries: response.data[key].entries
                    ? response.data[key].entries
                    : [],

                name: response.data[key].name,
                users: response.data[key].users,
            };
            budget.push(budgetObj);
        }
    }
    return budget;
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
