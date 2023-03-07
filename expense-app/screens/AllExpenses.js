import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { BudgetsContext } from '../store/budgets-context';
import MonthYearSelector from './MonthYearSelector';

function AllExpenses({ navigation }) {
    const budgetCtx = useContext(BudgetsContext);
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const isFocused = useIsFocused();

    const monthYearData = (year, month) => {
        if (year && month) {
            setMonth(month);
            setYear(year);
        }
    };

    const expenses = budgetCtx.getExpenses(
        budgetCtx.selectedBudgetId,
        month,
        year
    );

    return (
        <>
            <MonthYearSelector onSelect={monthYearData} />
            {month && year && (
                <ExpensesOutput
                    expenses={expenses}
                    month={month}
                    year={year}
                    isFocused={isFocused}
                    expensesPeriod='Total'
                    fallbackText='No registered expenses found!'
                />
            )}
        </>
    );
}

export default AllExpenses;
