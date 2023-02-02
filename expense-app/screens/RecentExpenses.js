import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/http';

function RecentExpenses() {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    const expensesCtx = useContext(ExpensesContext);

    useEffect(() => {
        async function getExpenses() {
            setIsFetching(true);
            try {
                const token = expensesCtx.token;
                const email = expensesCtx.email;
                const expenses = await fetchExpenses('auth=' + token, email);
                expensesCtx.setExpenses(expenses);
            } catch (error) {
                setError('Could not fetch');
            }
            setIsFetching(false);
        }
        getExpenses();
    }, []);
    function errorHandler() {
        setError(null);
    }
    if (error) {
        return <ErrorOverlay onConfirm={errorHandler} message={error} />;
    }
    if (isFetching) {
        return <LoadingOverlay />;
    }
    const recentExpenses = expensesCtx.expenses.filter((expense) => {
        const today = new Date();
        const date14DaysAgo = getDateMinusDays(today, 14);

        return expense.date >= date14DaysAgo && expense.date <= today;
    });

    return (
        <ExpensesOutput
            expenses={recentExpenses}
            expensesPeriod='Last 14 Days'
            fallbackText='No transaction registered for the last 14 days.'
        />
    );
}

export default RecentExpenses;
