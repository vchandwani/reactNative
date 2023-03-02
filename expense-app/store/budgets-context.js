import { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BudgetsContext = createContext({
    budgets: [],
    setBudgets: (budgets) => {},
    selectedBudgetId: '',
    setSelectedBudgetId: (id) => {},
    addBudgetEntry: ({ name, amount, category, recurring }, budgetId) => {},
    deleteBudgetEntry: (id, budgetId) => {},
    updateBudgetEntry: (
        id,
        { name, amount, category, recurring },
        budgetId
    ) => {},

    addExpense: ({ description, amount, date, email }, budgetId) => {},
    deleteExpense: (id, budgetId) => {},
    updateExpense: (id, { description, amount, date, email }) => {},

    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: (token, email) => {},
    logout: () => {},
});

function budgetsReducer(state, action) {
    const budgetIndex = state.findIndex((el) => el.id === action.budgetId);
    switch (action.type) {
        case 'ADDENTRY':
            state[budgetIndex].entries[action.payload.id] = action.payload;
            return state;
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
        case 'UPDATEENTRY':
            state[budgetIndex].entries[action.payload.id] = action.payload.data;
            return state;
        case 'DELETEENTRY':
            delete state[budgetIndex]['entries'][action.payload];
            return state;

        case 'ADDEXPENSE':
            state[budgetIndex].expenses[action.payload.id] =
                action.payload.data;
            return state;

        case 'UPDATEEXPENSE':
            state[budgetIndex].expenses[action.payload.id] =
                action.payload.data;

            return state;
        case 'DELETEEXPENSE':
            delete state[budgetIndex]['expenses'][action.payload];
            return state;

        default:
            return state;
    }
}

function BudgetsContextProvider({ children }) {
    const [budgetsState, dispatch] = useReducer(budgetsReducer, []);

    const [authToken, setAuthToken] = useState();
    const [email, setEmail] = useState();

    const [budgetId, setBudgetId] = useState();

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

    function addBudgetEntry(budgetData, budgetId) {
        dispatch({ type: 'ADDENTRY', payload: budgetData, budgetId: budgetId });
    }

    function setBudgets(budgets) {
        dispatch({ type: 'SET', payload: budgets });
    }

    function setSelectedBudgetId(id) {
        setBudgetId(id);
    }

    function deleteBudgetEntry(id, budgetId) {
        dispatch({ type: 'DELETEENTRY', payload: id, budgetId: budgetId });
    }

    function updateBudgetEntry(id, entryData, budgetId) {
        dispatch({
            type: 'UPDATEENTRY',
            payload: { id: id, data: entryData },
            budgetId: budgetId,
        });
    }

    function addExpense(expenseData, budgetId) {
        dispatch({
            type: 'ADDEXPENSE',
            payload: expenseData,
            budgetId: budgetId,
        });
    }

    function deleteExpense(id, budgetId) {
        dispatch({ type: 'DELETEEXPENSE', payload: id, budgetId: budgetId });
    }

    function updateExpense(id, expenseData, budgetId) {
        dispatch({
            type: 'UPDATEEXPENSE',
            payload: { id: id, data: expenseData },
            budgetId: budgetId,
        });
    }

    const value = useMemo(() => ({
        budgets: budgetsState,
        setBudgets: setBudgets,
        selectedBudgetId: budgetId,
        setSelectedBudgetId: setSelectedBudgetId,
        addBudgetEntry: addBudgetEntry,
        deleteBudgetEntry: deleteBudgetEntry,
        updateBudgetEntry: updateBudgetEntry,
        token: authToken,
        email: email,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,

        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense,
    }));

    return (
        <BudgetsContext.Provider value={value}>
            {children}
        </BudgetsContext.Provider>
    );
}

export default BudgetsContextProvider;
