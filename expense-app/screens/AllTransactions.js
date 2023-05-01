import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import TransactionsOutput from '../components/TransactionsOutput/TransactionsOutput';
import { BudgetsContext } from '../store/budgets-context';
import MonthYearSelector from '../components/UI/MonthYearSelector';
import {
    getMonthAndYear,
    getMonthsArray,
    getRecurringTransactionDate,
    getYearsArray,
    objectToArray,
} from '../util/data';
import { newTransactionHandler } from './ManageTransaction';
import Accordian from '../components/UI/Accordian';
import { SafeAreaView } from 'react-native';
import { EXPENSE, INCOME } from '../util/constants';
import { styles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { storeBudgetMonthlyEntry } from '../util/http';

async function newBudgetMonthlyEntry(budgetId, year, month, data, token, ctx) {
    const id = await storeBudgetMonthlyEntry(
        budgetId,
        year,
        month,
        data,
        'auth=' + token
    );
    ctx.addBudgetMonthlyEntry(id, { ...data, id: id }, budgetId, month, year);
}

function AllTransactions() {
    const budgetCtx = useContext(BudgetsContext);

    const yearsArray = getYearsArray();

    const [transactionIncomeEntries, setTransactionIncomeEntries] = useState(
        []
    );
    const [transactionExpenseEntries, setTransactionExpenseEntries] = useState(
        []
    );
    const isFocused = useIsFocused();
    const [year, setYear] = useState(yearsArray[0]);
    const [months, setMonths] = useState();
    const [month, setMonth] = useState();
    const [isSubmitting, setIsSubmitting] = useState(true);
    const date = new Date().toISOString();
    const dataMonthYear = getMonthAndYear(date);

    const currentBudgetRecurringCategories =
        budgetCtx.currentBudgetCategories?.filter((btgCat) => {
            return btgCat?.recurring;
        });

    useEffect(() => {
        setMonth(dataMonthYear.month);
        setYear(dataMonthYear.year);
    }, []);

    useEffect(() => {
        setMonths(getMonthsArray(year));
    }, [year]);

    useEffect(() => {
        months && setMonth(months[0]);
    }, [months]);

    useEffect(() => {
        setIsSubmitting(true);
        if (isFocused && month && year) {
            // call the function
            transactionsArray();
        }
    }, [month, year, isFocused]);

    useEffect(() => {
        if (
            month &&
            year &&
            !isSubmitting &&
            transactionIncomeEntries.length === 0 &&
            transactionExpenseEntries.length === 0
        ) {
            const { entries, monthlyEntries, transactions } =
                budgetCtx?.budgets?.find(
                    (el) => el.id === budgetCtx.selectedBudgetId
                );

                (async () => {
                     // make monthly entries from base entries
                     setIsSubmitting(true)
                    if (entries && !monthlyEntries?.[year]?.[month]) {
                        objectToArray(entries)?.map((budgetEntryData) => {
                            budgetEntryData.id = null;
                            newBudgetMonthlyEntry(
                                budgetCtx.selectedBudgetId,
                                year,
                                month,
                                budgetEntryData,
                                budgetCtx.token,
                                budgetCtx
                            );
                        });
                    }
                    if (!transactions?.[year]?.[month]) {
                        // No Entries, enter recurring entries for the month selected
                        // Recurring transaction for the month and year if entries not present, newTransactionHandler called
                        const dateFormMonthYear = getRecurringTransactionDate(
                            month,
                            year
                        );
        
                        currentBudgetRecurringCategories?.map((budgetCatg) => {
                            // check entry present
                            const data = {
                                amount: budgetCatg.amount,
                                budgetId: budgetCtx.selectedBudgetId,
                                category: budgetCatg.name,
                                type: budgetCatg.category,
                                date: dateFormMonthYear,
                                description:
                                    budgetCatg.name +
                                    ' ' +
                                    dataMonthYear.month +
                                    ' ' +
                                    dataMonthYear.year +
                                    ' entry',
                                email: budgetCtx.email,
                            };
                            newTransactionHandler(
                                budgetCtx.selectedBudgetId,
                                budgetCtx.token,
                                data,
                                month,
                                year,
                                budgetCtx
                            );
                        });
                    }
                    setIsSubmitting(false)
                  })();
        }
    }, [
        transactionIncomeEntries.length,
        transactionExpenseEntries.length,
        isSubmitting,
    ]);

    const monthSelect = (month) => {
        if (month) {
            setMonth(month);
        }
    };
    const yearSelect = (year) => {
        if (year) {
            setYear(year);
        }
    };

    const transactionsArray = () => {
        setIsSubmitting(true);

        setTimeout(() => {
            formatTransactions(
                budgetCtx.getTransactions(
                    budgetCtx.selectedBudgetId,
                    month,
                    year
                )
            );
        }, 100);
    };

    const formatTransactions = (data) => {
        let incomeExp = [];
        let expenseExp = [];

        if (Object.entries(data).length) {
            let i = 0;
            for (const [key, value] of Object.entries(data)) {
                if (value.type === INCOME) {
                    incomeExp.push({
                        ...value,
                        id: key,
                    });
                } else if (value.type === EXPENSE) {
                    expenseExp.push({
                        ...value,
                        id: key,
                    });
                }
                i++;
                if (i === Object.entries(data).length) {
                    setTransactionIncomeEntries(incomeExp);
                    setTransactionExpenseEntries(expenseExp);
                    setIsSubmitting(false);
                }
            }
        } else {
            setIsSubmitting(false);
            setTransactionIncomeEntries([]);
            setTransactionExpenseEntries([]);
        }
    };

    if (isSubmitting) {
        return <LoadingOverlay />;
    }
    return (
        <SafeAreaView style={styles.rootContainer}>
            <Accordian
                title={'Month Year Selector'}
                data={
                    <MonthYearSelector
                        onYearChange={yearSelect}
                        onMonthChange={monthSelect}
                        yearDefault={year}
                        monthDefault={month}
                        years={yearsArray}
                        months={months}
                    />
                }
            />
            <Accordian
                title={'Icnome Transactions'}
                data={
                    <TransactionsOutput
                        transactions={transactionIncomeEntries}
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
        </SafeAreaView>
    );
}

export default AllTransactions;
