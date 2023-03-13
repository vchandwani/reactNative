import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import TransactionsOutput from '../components/TransactionsOutput/TransactionsOutput';
import { BudgetsContext } from '../store/budgets-context';
import MonthYearSelector from './MonthYearSelector';
import { getMonthAndYear, getMonthsArray, getYearsArray } from '../util/data';
import { newTransactionHandler } from './ManageTransaction';
import Accordian from '../components/UI/Accordian';
import { ScrollView } from 'react-native';
import { EXPENSE, INCOME } from '../util/constants';
import { styles } from '../constants/styles';

function AllTransactions() {
    const budgetCtx = useContext(BudgetsContext);
    const [transactions, setTransactions] = useState([]);
    const isFocused = useIsFocused();
    const yearsArray = getYearsArray();
    const [year, setYear] = useState(yearsArray[0]);
    const [months, setMonths] = useState([]);
    const [month, setMonth] = useState(months[0]);
    const [isFocusedVal, setIsFocusedVal] = useState(isFocused);

    const currentBudgetRecurringCategories =
        budgetCtx.currentBudgetCategories?.filter((btgCat) => {
            return btgCat?.recurring;
        });
    const monthYearData = (year, month) => {
        if (year && month) {
            setMonth(month);
            setYear(year);
            setIsFocusedVal(true);
        }
    };

    const transactionsArray = () => {
        setTransactions(
            budgetCtx.getTransactions(budgetCtx.selectedBudgetId, month, year)
        );
    };

    let trasactionIncomeEntries = [];
    let transactionExpenseEntries = [];

    useEffect(() => {
        setIsFocusedVal(isFocused);
    }, [isFocused]);

    useEffect(() => {
        setMonths(getMonthsArray(year));
    }, [year]);

    useEffect(() => {
        setMonth(months[0]);
    }, [months]);

    useEffect(() => {
        for (const [key, value] of Object.entries(transactions)) {
            if (value.type === INCOME) {
                trasactionIncomeEntries.push({
                    ...value,
                    id: key,
                });
            } else if (value.type === EXPENSE) {
                transactionExpenseEntries.push({
                    ...value,
                    id: key,
                });
            }
        }
    }, [transactions]);

    useEffect(() => {
        if (isFocused) {
            transactionsArray();
        }
    }, [month, year, isFocused]);

    // useEffect(() => {
    //     if (refresh < 2) {
    //         setTimeout(() => {
    //             transactionsArray();
    //             setRefresh(refresh + 1);
    //         }, 2000);
    //     }

    //     if (month && year && refresh === 1 && transactions.length === 0) {
    //         // No Entries, enter recurring entries for the month selected
    //         const date = new Date().toISOString();
    //         const dataMonthYear = getMonthAndYear(date);

    //         // Recurring transaction for the month and year if entries not present, newTransactionHandler called
    //         currentBudgetRecurringCategories.map((budgetCatg) => {
    //             // check entry present
    //             const data = {
    //                 amount: budgetCatg.amount,
    //                 budgetId: budgetCtx.selectedBudgetId,
    //                 category: budgetCatg.name,
    //                 type: budgetCatg.category,
    //                 date: date,
    //                 description:
    //                     budgetCatg.name +
    //                     ' ' +
    //                     dataMonthYear.month +
    //                     ' ' +
    //                     dataMonthYear.year +
    //                     ' entry',
    //                 email: budgetCtx.email,
    //             };

    //             newTransactionHandler(
    //                 budgetCtx.selectedBudgetId,
    //                 budgetCtx.token,
    //                 data,
    //                 dataMonthYear.month,
    //                 dataMonthYear.year,
    //                 budgetCtx
    //             );
    //         });
    //     }
    // }, [month, year, refresh, transactions.length]);

    return (
        <ScrollView style={styles.container}>
            <Accordian
                title={'Month Year Selector'}
                data={
                    <MonthYearSelector
                        onSelect={monthYearData}
                        months={months}
                        years={yearsArray}
                        month={month}
                        year={year}
                    />
                }
            />
            <Accordian
                title={'Icnome Transactions'}
                data={
                    <TransactionsOutput
                        transactions={trasactionIncomeEntries}
                        month={month}
                        year={year}
                        isFocused={isFocused}
                        transactionsPeriod='Total Income'
                        fallbackText='No registered transactions found!'
                    />
                }
                open={false}
            />
            <Accordian
                title={'Expense Transactions'}
                data={
                    <TransactionsOutput
                        transactions={transactionExpenseEntries}
                        month={month}
                        year={year}
                        isFocused={isFocused}
                        transactionsPeriod='Total Expense'
                        fallbackText='No registered transactions found!'
                    />
                }
                open={true}
            />
        </ScrollView>
    );
}

export default AllTransactions;
