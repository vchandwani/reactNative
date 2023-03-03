import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { BudgetsContext } from '../store/budgets-context';
import { getDateMinusDays } from '../util/date';
import { useIsFocused } from '@react-navigation/native';

function RecentExpenses() {
    const isFocused = useIsFocused();

    const [expenses, setExpenses] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const [recentExpenses, setRecentExpenses] = useState();

    const budgetCtx = useContext(BudgetsContext);

    useEffect(() => {
        setExpenses(budgetCtx.getExpenses(budgetCtx.selectedBudgetId));
    }, [isFocused, budgetCtx.selectedBudgetId]);

    useEffect(() => {
        const today = new Date();
        const date14DaysAgo = getDateMinusDays(today, 14);
        const keys =
            expenses &&
            Object.keys(expenses)?.filter((expense) => {
                return (
                    new Date(expenses[expense].date) >= date14DaysAgo &&
                    new Date(expenses[expense].date) <= today
                );
            });

        const filtered =
            expenses &&
            Object.keys(expenses)
                .filter((key) => keys.includes(key))
                .reduce((obj, key) => {
                    obj[key] = expenses[key];
                    return obj;
                }, {});
        filtered && setRecentExpenses(filtered);

        setIsFetching(false);
    }, [isFocused, expenses]);

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
            expenses={recentExpenses ? recentExpenses : []}
            expensesPeriod='Last 14 Days'
            fallbackText='No transaction registered for the last 14 days.'
        />
    );
}

export default RecentExpenses;
