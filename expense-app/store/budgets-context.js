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

    addExpense: (
        id,
        { description, amount, date, email },
        budgetId,
        month,
        year
    ) => {},
    deleteExpense: (id, budgetId, month, year) => {},
    updateExpense: (
        id,
        { description, amount, date, email },
        budgetId,
        month,
        year
    ) => {},

    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: (token, email) => {},
    logout: () => {},
    getExpenses: (budgetId, month, year) => {},

    setCurrentBudgetCategories: (dataCategories) => {},
    currentBudgetCategories: '',
});

function budgetsReducer(state, action) {
    const budgetIndex = state?.findIndex((el) => el.id === action.budgetId);

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
            if (!state[budgetIndex]['expenses'][action.year]) {
                state[budgetIndex]['expenses'][action.year] = {};
            }
            if (!state[budgetIndex]['expenses'][action.year][action.month]) {
                state[budgetIndex]['expenses'][action.year][action.month] = {};
            }
            state[budgetIndex]['expenses'][action.year][action.month][
                action.payload.id
            ] = action.payload.data;
            return state;

        case 'UPDATEEXPENSE':
            if (!state[budgetIndex]['expenses'][action.year]) {
                state[budgetIndex]['expenses'][action.year] = {};
            }
            if (!state[budgetIndex]['expenses'][action.year][action.month]) {
                state[budgetIndex]['expenses'][action.year][action.month] = {};
            }
            state[budgetIndex].expenses[action.year][action.month][
                action.payload.id
            ] = action.payload.data;
            return state;
        case 'DELETEEXPENSE':
            delete state[budgetIndex]['expenses'][action.year][action.month][
                action.payload
            ];
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
    const [budgetExpenseCategories, setBudgetExpenseCategories] = useState();

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

    function addExpense(id, expenseData, budgetId, month, year) {
        dispatch({
            type: 'ADDEXPENSE',
            payload: { id: id, data: expenseData },
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function deleteExpense(id, budgetId, month, year) {
        dispatch({
            type: 'DELETEEXPENSE',
            payload: id,
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function updateExpense(id, expenseData, budgetId, month, year) {
        dispatch({
            type: 'UPDATEEXPENSE',
            payload: { id: id, data: expenseData },
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function getExpenses(budgetId, month = '', year = '') {
        const indexVal = budgetsState?.findIndex((el) => el.id === budgetId);
        return budgetsState[indexVal]['expenses']?.[year]?.[month]
            ? budgetsState[indexVal]['expenses'][year][month]
            : [];
    }

    function setCurrentBudgetCategories(dataCategories) {
        setBudgetExpenseCategories(dataCategories);
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
        getExpenses: getExpenses,

        setCurrentBudgetCategories: setCurrentBudgetCategories,
        currentBudgetCategories: budgetExpenseCategories,
    }));

    return (
        <BudgetsContext.Provider value={value}>
            {children}
        </BudgetsContext.Provider>
    );
}

export default BudgetsContextProvider;
