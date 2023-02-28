import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { BudgetsContext } from '../store/budgets-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/http';

function RecentExpenses() {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const [recentExpenses, setRecentExpenses] = useState();

    const expCtx = useContext(ExpensesContext);
    const budgetCtx = useContext(BudgetsContext);

    useEffect(() => {
        async function getExpenses() {
            setIsFetching(true);
            try {
                const selectedBudgetId = budgetCtx.selectedBudgetId;
                const token = budgetCtx.token;
                const email = budgetCtx.email;
                const expenses = await fetchExpenses(
                    'auth=' + token,
                    selectedBudgetId
                );
                expCtx.setExpenses(expenses);
            } catch (error) {
                setError('Could not fetch');
                if (error.response.status === 401) {
                    budgetCtx.logout();
                }
            }
            setIsFetching(false);
        }
        getExpenses();
    }, []);
    useEffect(() => {
        setRecentExpenses(
            expCtx.expenses.filter((expense) => {
                const today = new Date();
                const date14DaysAgo = getDateMinusDays(today, 14);

                return expense.date >= date14DaysAgo && expense.date <= today;
            })
        );
    }, [expCtx.expenses]);
    function errorHandler() {
        setError(null);
    }
    if (error) {
        return <ErrorOverlay onConfirm={errorHandler} message={error} />;
    }
    if (isFetching) {
        return <LoadingOverlay />;
    }

    return (
        <ExpensesOutput
            expenses={recentExpenses}
            expensesPeriod='Last 14 Days'
            fallbackText='No transaction registered for the last 14 days.'
        />
    );
}

export default RecentExpenses;
