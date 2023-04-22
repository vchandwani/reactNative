import React, { useContext, useEffect, useRef, useState } from 'react';

import { BudgetsContext } from '../store/budgets-context';
import { getMonthsArray, getYearsArray, objectToArray } from '../util/data';
import { SafeAreaView, View, Dimensions } from 'react-native';
import { styles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import YearScroll from '../components/UI/YearScroll';
import { EXPENSE, INCOME } from '../util/constants';
import { DataTable, Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

function AnnualOverview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [yearIndex, setYearIndex] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);
  const diffAmount = useRef([]);
  const chartLabels = useRef([]);

  let totalSpentAmount = 0;
  let totalIncomeAmount = 0;
  let monthsArray = [];
  const budgetCtx = useContext(BudgetsContext);
  const screenWidth = Dimensions.get('window').width;

  const yearsArray = getYearsArray().reverse();
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Monthly Money Left'], // optional
  });

  useEffect(() => {
    setYearlyData([]);
    setYearIndex(yearsArray.length - 1);
  }, [yearsArray.length]);

  useEffect(() => {
    diffAmount.current = [];
    chartLabels.current = [];

    const { monthlyEntries, transactions } = budgetCtx?.budgets?.find(
      (el) => el.id === budgetCtx.selectedBudgetId
    );
    monthsArray = getMonthsArray(yearsArray[yearIndex]).reverse();

    setIsSubmitting(true);
    monthsArray.map((mnth) => {
      if (monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]) {
        let income = 0;
        let expense = 0;

        if (objectToArray(monthlyEntries?.[yearsArray[yearIndex]]?.[mnth])) {
          const incomeData = objectToArray(
            monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]
          )?.filter((tx) => {
            return tx.category === INCOME;
          });
          income = incomeData?.reduce((sum, { amount }) => sum + amount, 0);
        }

        if (objectToArray(transactions?.[yearsArray[yearIndex]]?.[mnth])) {
          const expData = objectToArray(
            transactions?.[yearsArray[yearIndex]]?.[mnth]
          )?.filter((tx) => {
            return tx.type === EXPENSE;
          });
          expense = expData?.reduce((sum, { amount }) => sum + amount, 0);
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

  useEffect(() => {
    setChartData({
      ...chartData,
      labels: [...chartLabels.current],
      datasets: [
        {
          ...chartData.datasets[0],
          data: [...diffAmount.current],
        },
      ],
    });
  }, [diffAmount.current, chartLabels.current]);

  const onYearChange = (val) => {
    totalSpentAmount = 0;
    totalIncomeAmount = 0;
    setYearlyData([]);
    setYearIndex((oldVal) => oldVal + val);
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <SafeAreaView style={styles.yearlyContainer}>
      <View style={{ height: 50, margin: 4 }}>
        <YearScroll
          onYearChange={onYearChange}
          index={yearIndex}
          years={yearsArray}
          style={[styles.form]}
        />
      </View>
      <View style={[styles.form]}>
        <View>
          <Text>Bezier Line Chart</Text>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel='$'
            yAxisSuffix='k'
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </View>
      {yearlyData && (
        <View style={[styles.form, styles.flex]}>
          <DataTable
            style={(styles.container, styles.flex, { paddingBottom: 12 })}
          >
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
              diffAmount.current.push(monthlyData.income - monthlyData.expense);
              chartLabels.current.push(monthlyData.name);

              return (
                <DataTable.Row style={styles.amount} key={monthlyData + i}>
                  <DataTable.Cell>
                    <Text style={styles.amount}>{monthlyData.name}</Text>
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
                        monthlyData.expense > monthlyData.income &&
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
        </View>
      )}
    </SafeAreaView>
  );
}

export default AnnualOverview;
