import { createContext, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BudgetsContext = createContext({
    budgets: [],
    addBudget: ({ name, amount, category, recurring }) => {},
    setBudgets: (budgets) => {},
    deleteBudget: (id) => {},
    updateBudget: (id, { name, amount, category, recurring }) => {},
    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: (token, email) => {},
    logout: () => {},
});

function budgetsReducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return [action.payload, ...state];
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
        case 'UPDATE':
            const updatableBudgetIndex = state.findIndex(
                (budget) => budget.id === action.payload.id
            );
            const updatableBudget = state[updatableBudgetIndex];
            const updatedItem = { ...updatableBudget, ...action.payload.data };
            const updatedBudgets = [...state];
            updatedBudgets[updatableBudgetIndex] = updatedItem;
            return updatedBudgets;
        case 'DELETE':
            return state.filter((budget) => budget.id !== action.payload);
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

    function addBudget(budgetData) {
        dispatch({ type: 'ADD', payload: budgetData });
    }

    function setBudgets(budgets) {
        dispatch({ type: 'SET', payload: budgets });
    }

    function deleteBudget(id) {
        dispatch({ type: 'DELETE', payload: id });
    }

    function updateBudget(id, budgetData) {
        dispatch({ type: 'UPDATE', payload: { id: id, data: budgetData } });
    }

    const value = useMemo(() => ({
        budgets: budgetsState,
        setBudgets: setBudgets,
        addBudget: addBudget,
        deleteBudget: deleteBudget,
        updateBudget: updateBudget,
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
