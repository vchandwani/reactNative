import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import TransactionsOutput from '../components/TransactionsOutput/TransactionsOutput';
import { BudgetsContext } from '../store/budgets-context';
import MonthYearSelector from '../components/UI/MonthYearSelector';
import { getMonthAndYear, getMonthsArray, getYearsArray } from '../util/data';
import Accordian from '../components/UI/Accordian';
import { SafeAreaView } from 'react-native';
import { EXPENSE, INCOME } from '../util/constants';
import { styles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';

function AllTransactions() {
  const budgetCtx = useContext(BudgetsContext);

  const yearsArray = getYearsArray();

  const [transactionIncomeEntries, setTransactionIncomeEntries] = useState([]);
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
  }, [month, year, isFocused, budgetCtx.budgets]);

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

  const transactionsArray = async () => {
    setIsSubmitting(true);

    await formatTransactions(
      budgetCtx.getTransactions(budgetCtx.selectedBudgetId, month, year)
    );
  };

  const formatTransactions = async (data) => {
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
