import { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPENSE } from '../util/constants';
import { objectToArray } from '../util/data';

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

    addTransaction: (
        id,
        { description, amount, date, email },
        budgetId,
        month,
        year
    ) => {},
    deleteTransaction: (id, budgetId, month, year) => {},
    updateTransaction: (
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
    getTransactions: (budgetId, month, year) => {},

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

        case 'ADDTRANSACTION':
            if (!state[budgetIndex]['transactions'][action.year]) {
                state[budgetIndex]['transactions'][action.year] = {};
            }
            if (
                !state[budgetIndex]['transactions'][action.year][action.month]
            ) {
                state[budgetIndex]['transactions'][action.year][action.month] =
                    {};
            }
            state[budgetIndex]['transactions'][action.year][action.month][
                action.payload.id
            ] = action.payload.data;
            return state;

        case 'UPDATETRANSACTION':
            if (!state[budgetIndex]['transactions'][action.year]) {
                state[budgetIndex]['transactions'][action.year] = {};
            }
            if (
                !state[budgetIndex]['transactions'][action.year][action.month]
            ) {
                state[budgetIndex]['transactions'][action.year][action.month] =
                    {};
            }
            state[budgetIndex].transactions[action.year][action.month][
                action.payload.id
            ] = action.payload.data;
            return state;
        case 'DELETETRANSACTION':
            delete state[budgetIndex]['transactions'][action.year][
                action.month
            ][action.payload];
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

    function addTransaction(id, transactionData, budgetId, month, year) {
        dispatch({
            type: 'ADDTRANSACTION',
            payload: { id: id, data: transactionData },
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function deleteTransaction(id, budgetId, month, year) {
        dispatch({
            type: 'DELETETRANSACTION',
            payload: id,
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function updateTransaction(id, transactionData, budgetId, month, year) {
        dispatch({
            type: 'UPDATETRANSACTION',
            payload: { id: id, data: transactionData },
            budgetId: budgetId,
            month: month,
            year: year,
        });
    }

    function getTransactions(budgetId, month = '', year = '') {
        const indexVal = budgetsState?.findIndex((el) => el.id === budgetId);
        const monthlyData =
            budgetsState[indexVal]['transactions']?.[year]?.[month];

        const expenseTransactions = monthlyData ? monthlyData : [];

        return expenseTransactions;
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

        addTransaction: addTransaction,
        deleteTransaction: deleteTransaction,
        updateTransaction: updateTransaction,
        getTransactions: getTransactions,

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
