import axios from 'axios';

export const BACKEND_URL =
  'https://react-native-course-624d6-default-rtdb.firebaseio.com/';

export async function storeTransaction(
  budgetId,
  transactionData,
  auth,
  month,
  year
) {
  const response = await axios.post(
    BACKEND_URL +
      `budget/${budgetId}/transactions/${year}/${month}.json?` +
      auth,
    transactionData
  );

  const id = response.data.name;
  return id;
}

export function updateTransaction(
  budgetId,
  id,
  transactionData,
  auth,
  month,
  year
) {
  return axios.put(
    BACKEND_URL +
      `budget/${budgetId}/transactions/${year}/${month}/${id}.json?` +
      auth,
    transactionData
  );
}

export function deleteTransaction(budgetId, id, auth, month, year) {
  return axios.delete(
    BACKEND_URL +
      `budget/${budgetId}/transactions/${year}/${month}/${id}.json?` +
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

export async function storeBudgetMonthlyEntry(
  budgetId,
  year,
  month,
  entryData,
  auth
) {
  const response = await axios.post(
    BACKEND_URL +
      `budget/${budgetId}/monthlyEntries/${year}/${month}.json?` +
      auth,
    entryData
  );
  const id = response.data.name ? response.data.name : null;
  return id;
}
