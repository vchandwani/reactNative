import { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amount, date, email }) => {},
    setExpenses: (expenses) => {},
    deleteExpense: (id) => {},
    updateExpense: (id, { description, amount, date, email }) => {},
    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: (token, email) => {},
    logout: () => {},
});

function expensesReducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return [action.payload, ...state];
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id
            );
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = { ...updatableExpense, ...action.payload.data };
            const updatedExpenses = [...state];
            updatedExpenses[updatableExpenseIndex] = updatedItem;
            return updatedExpenses;
        case 'DELETE':
            return state.filter((expense) => expense.id !== action.payload);
        default:
            return state;
    }
}

function ExpensesContextProvider({ children }) {
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    const [authToken, setAuthToken] = useState();
    const [email, setEmail] = useState();

    function authenticate(token, email = '') {
        setAuthToken(token);
        setEmail(email);
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('email', email);
    }

    function logout() {
        setAuthToken(null);
        setEmail(null);
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('email');
    }

    function addExpense(expenseData) {
        dispatch({ type: 'ADD', payload: expenseData });
    }

    function setExpenses(expenses) {
        dispatch({ type: 'SET', payload: expenses });
    }

    function deleteExpense(id) {
        dispatch({ type: 'DELETE', payload: id });
    }

    function updateExpense(id, expenseData) {
        dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData } });
    }

    const value = useMemo(() => ({
        expenses: expensesState,
        setExpenses: setExpenses,
        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
        token: authToken,
        email: email,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
    }));

    return (
        <ExpensesContext.Provider value={value}>
            {children}
        </ExpensesContext.Provider>
    );
}

export default ExpensesContextProvider;
