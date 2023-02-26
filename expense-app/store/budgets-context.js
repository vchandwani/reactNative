import { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BudgetsContext = createContext({
    budgets: [],
    addBudgetEntry: ({ name, amount, category, recurring }, budgetId) => {},
    setBudgets: (budgets) => {},
    deleteBudgetEntry: (id, budgetId) => {},
    updateBudgetEntry: (
        id,
        { name, amount, category, recurring },
        budgetId
    ) => {},
    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: (token, email) => {},
    logout: () => {},
});

function budgetsReducer(state, action) {
    switch (action.type) {
        case 'ADDENTRY':
            let selectedBudgetStateIndex = state.findIndex(
                (el) => el.id === action.budgetId
            );

            state[selectedBudgetStateIndex].entries[action.payload.id] =
                action.payload;

            return state;
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
        case 'UPDATEENTRY':
            const updatableBudgetIndex = state.findIndex(
                (budget) => budget.id === action.budgetId
            );
            state[updatableBudgetIndex].entries[action.payload.id] =
                action.payload.data;
            return state;
        case 'DELETEENTRY':
            const budgetIndex = state.findIndex(
                (budget) => budget.id === action.budgetId
            );
            delete state[budgetIndex]['entries'][action.payload];
            return state;
        default:
            return state;
    }
}

function BudgetsContextProvider({ children }) {
    const [budgetsState, dispatch] = useReducer(budgetsReducer, []);

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

    function addBudgetEntry(budgetData, budgetId) {
        dispatch({ type: 'ADDENTRY', payload: budgetData, budgetId: budgetId });
    }

    function setBudgets(budgets) {
        dispatch({ type: 'SET', payload: budgets });
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

    const value = useMemo(() => ({
        budgets: budgetsState,
        setBudgets: setBudgets,
        addBudgetEntry: addBudgetEntry,
        deleteBudgetEntry: deleteBudgetEntry,
        updateBudgetEntry: updateBudgetEntry,
        token: authToken,
        email: email,
        isAuthenticated: !!authToken,
        authenticate: authenticate,
        logout: logout,
    }));

    return (
        <BudgetsContext.Provider value={value}>
            {children}
        </BudgetsContext.Provider>
    );
}

export default BudgetsContextProvider;
