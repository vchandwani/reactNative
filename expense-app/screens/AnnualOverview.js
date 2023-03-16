import React, { useContext, useEffect, useState } from 'react';

import { BudgetsContext } from '../store/budgets-context';
import { getMonthsArray, getYearsArray, objectToArray } from '../util/data';
import Accordian from '../components/UI/Accordian';
import { ScrollView } from 'react-native';
import { GlobalStyles, styles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import YearScroll from '../components/UI/YearScroll';
import { EXPENSE, INCOME } from '../util/constants';
import { DataTable, Text } from 'react-native-paper';

function AnnualOverview() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [yearIndex, setYearIndex] = useState(0);
    const [yearlyData, setYearlyData] = useState([]);

    let totalSpentAmount = 0;
    let totalIncomeAmount = 0;

    const budgetCtx = useContext(BudgetsContext);

    const yearsArray = getYearsArray().reverse();

    useEffect(() => {
        setYearlyData([]);
        setYearIndex(yearsArray.length - 1);
    }, [yearsArray.length]);
    useEffect(() => {
        const { monthlyEntries, transactions } = budgetCtx?.budgets?.find(
            (el) => el.id === budgetCtx.selectedBudgetId
        );
        const monthsArray = getMonthsArray(yearsArray[yearIndex]).reverse();
        setIsSubmitting(true);
        monthsArray.map((mnth) => {
            if (monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]) {
                let income = 0;
                let expense = 0;

                if (
                    objectToArray(
                        monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]
                    )
                ) {
                    const incomeData = objectToArray(
                        monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]
                    )?.filter((tx) => {
                        return tx.category === INCOME;
                    });
                    income = incomeData?.reduce(
                        (sum, { amount }) => sum + amount,
                        0
                    );
                }

                if (
                    objectToArray(transactions?.[yearsArray[yearIndex]]?.[mnth])
                ) {
                    const expData = objectToArray(
                        transactions?.[yearsArray[yearIndex]]?.[mnth]
                    )?.filter((tx) => {
                        return tx.type === EXPENSE;
                    });
                    expense = expData?.reduce(
                        (sum, { amount }) => sum + amount,
                        0
                    );
                }
                setYearlyData((old) => [
                    ...old,
                    {
                        name: mnth,
                        income: income,
                        expense: expense,
                    },
                ]);
            }
        });
        setIsSubmitting(false);
    }, [yearIndex]);
    const onYearChange = (val) => {
        totalSpentAmount = 0;
        totalIncomeAmount = 0;

        setYearIndex((oldVal) => oldVal + val);
    };
    if (isSubmitting) {
        return <LoadingOverlay />;
    }

    return (
        <ScrollView style={styles.container}>
            <YearScroll
                onYearChange={onYearChange}
                index={yearIndex}
                years={yearsArray}
            />
            {yearlyData && (
                <DataTable style={styles.container}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title>
                            <Text style={styles.amount}>Month</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.amount}>
                            <Text style={styles.amount}>Income</Text>
                        </DataTable.Title>
                        <DataTable.Title style={styles.amount}>
                            <Text style={styles.amount}>Spent</Text>
                        </DataTable.Title>
                    </DataTable.Header>
                    {yearlyData.map((monthlyData, i) => {
                        totalIncomeAmount += monthlyData.income;
                        totalSpentAmount += monthlyData.expense;
                        return (
                            <DataTable.Row
                                style={styles.amount}
                                key={monthlyData + i}
                            >
                                <DataTable.Cell>
                                    <Text style={styles.amount}>
                                        {monthlyData.name}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text style={styles.amount}>
                                        $ {monthlyData.income.toFixed(2)}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text
                                        style={[
                                            styles.amount,
                                            styles.red,
                                            monthlyData.expense >
                                                monthlyData.income &&
                                                styles.redBackground,
                                        ]}
                                    >
                                        $ {monthlyData.expense.toFixed(2)}
                                    </Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title>
                            <Text style={styles.amount}>Total</Text>
                        </DataTable.Title>
                        <DataTable.Title>
                            <Text style={[styles.amount, styles.green]}>
                                $ {totalIncomeAmount.toFixed(2)}
                            </Text>
                        </DataTable.Title>
                        <DataTable.Title>
                            <Text
                                style={[
                                    styles.amount,
                                    styles.red,
                                    totalSpentAmount > totalIncomeAmount &&
                                        styles.redBackground,
                                ]}
                            >
                                $ {totalSpentAmount.toFixed(2)}
                            </Text>
                        </DataTable.Title>
                    </DataTable.Header>
                </DataTable>
            )}
        </ScrollView>
    );
}

export default AnnualOverview;
