import { useContext } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { BudgetsContext } from '../store/budgets-context';

function AllExpenses() {
    const budgetCtx = useContext(BudgetsContext);

    const expenses = budgetCtx.getExpenses(budgetCtx.selectedBudgetId);

    return (
        <ExpensesOutput
            expenses={expenses}
            expensesPeriod='Total'
            fallbackText='No registered expenses found!'
        />
    );
}

export default AllExpenses;
