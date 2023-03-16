import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import OverviewOutput from '../components/OverviewOutput/OverviewOutput';
import { BudgetsContext } from '../store/budgets-context';
import MonthYearSelector from '../components/UI/MonthYearSelector';
import {
    getMonthAndYear,
    getMonthsArray,
    getYearsArray,
    objectToArray,
} from '../util/data';
import Accordian from '../components/UI/Accordian';
import { ScrollView } from 'react-native';
import { styles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';

function MonthlyOverview() {
    const budgetCtx = useContext(BudgetsContext);

    const yearsArray = getYearsArray();

    const isFocused = useIsFocused();
    const [year, setYear] = useState(yearsArray[0]);
    const [months, setMonths] = useState();
    const [month, setMonth] = useState();
    const [isSubmitting, setIsSubmitting] = useState(true);
    const [categoryWiseData, setCategoryWiseData] = useState([]);

    const date = new Date().toISOString();
    const dataMonthYear = getMonthAndYear(date);

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
    useEffect(() => {
        const { monthlyEntries, transactions } = budgetCtx?.budgets?.find(
            (el) => el.id === budgetCtx.selectedBudgetId
        );
        setCategoryWiseData([]);
        if (monthlyEntries?.[year]?.[month]) {
            objectToArray(monthlyEntries?.[year]?.[month]).map(
                (monthlyEntry) => {
                    let spentAmount = 0;
                    if (transactions?.[year]?.[month]) {
                        const categoryTransactions = objectToArray(
                            transactions?.[year]?.[month]
                        )?.filter((val) => {
                            return val.category === monthlyEntry.name;
                        });
                        if (categoryTransactions) {
                            spentAmount += categoryTransactions?.reduce(
                                (sum, { amount }) => sum + amount,
                                0
                            );
                        }
                    }
                    setCategoryWiseData((oldVal) => [
                        ...oldVal,
                        {
                            name: monthlyEntry.name,
                            targetAmount: monthlyEntry.amount,
                            spentAmount: spentAmount,
                            category: monthlyEntry.category,
                        },
                    ]);
                }
            );
        }

        setIsSubmitting(false);
    }, [month, year, isFocused]);
    if (isSubmitting) {
        return <LoadingOverlay />;
    }
    return (
        <ScrollView style={styles.container}>
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
                title={month + ' ' + year}
                data={
                    <OverviewOutput
                        categoryWiseData={categoryWiseData}
                        month={month}
                        year={year}
                        isFocused={isFocused}
                        period={'Overview'}
                        fallbackText='No Overview!'
                    />
                }
                open={true}
            />
        </ScrollView>
    );
}

export default MonthlyOverview;
