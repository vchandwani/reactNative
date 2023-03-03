import { useContext } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { BudgetsContext } from '../store/budgets-context';
import MOnthYearSelector from './MonthYearSelector';

function AllExpenses() {
    const budgetCtx = useContext(BudgetsContext);

    const expenses = budgetCtx.getExpenses(budgetCtx.selectedBudgetId);
    const monthYearData = (year, month) => {
        if (year && month) {
            console.log(year);
            console.log(month);
        }
    };

    return (
        <>
            <MOnthYearSelector onSelect={monthYearData} />
            <ExpensesOutput
                expenses={expenses}
                expensesPeriod='Total'
                fallbackText='No registered expenses found!'
            />
        </>
    );
}

export default AllExpenses;
