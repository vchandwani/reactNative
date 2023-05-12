import React, { useContext, useEffect, useState, useRef } from 'react';

import { BudgetsContext } from '../store/budgets-context';
import { getMonthsArray, getYearsArray, objectToArray } from '../util/data';
import {
  SafeAreaView,
  View,
  Dimensions,
  FlatList,
  Animated,
  ScrollView,
} from 'react-native';
import { styles, GlobalStyles } from '../constants/styles';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import YearScroll from '../components/UI/YearScroll';
import { EXPENSE, INCOME } from '../util/constants';
import { DataTable, Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import Carousel from '../components/UI/Carousel';

function AnnualOverview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [yearIndex, setYearIndex] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryWiseData, setCategoryWiseData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0).current);

  const slideRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  let totalSpentAmount = 0;
  let totalIncomeAmount = 0;
  let monthsArray = [];
  const budgetCtx = useContext(BudgetsContext);

  const yearsArray = getYearsArray().reverse();
  const chartConfig = {
    backgroundColor: GlobalStyles.colors.gray100,
    backgroundGradientFrom: GlobalStyles.colors.primary50,
    backgroundGradientTo: GlobalStyles.colors.primary50,
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
  };

  const [chartLabel, setChartLabel] = useState([]);
  const [chartDataset, setChartDataset] = useState([]);

  useEffect(() => {
    setYearlyData([]);
    setCategoryWiseData(null);
    setYearIndex(yearsArray.length - 1);
  }, [yearsArray.length]);

  useEffect(() => {
    setChartLabel([]);
    setChartDataset([]);
    setCategoryWiseData(null);

    const labelsArray = [];
    const dataSetArray = [];
    let annualCategoryTransactions = [];

    const { monthlyEntries, transactions } = budgetCtx?.budgets?.find(
      (el) => el.id === budgetCtx.selectedBudgetId
    );
    monthsArray = getMonthsArray(yearsArray[yearIndex]).reverse();

    setIsSubmitting(true);
    monthsArray.map((mnth) => {
      if (monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]) {
        objectToArray(monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]).map(
          (monthlyEntry) => {
            let spentAmount = 0;
            let categoryTransactions = [];
            if (transactions?.[yearsArray[yearIndex]]?.[mnth]) {
              categoryTransactions = objectToArray(
                transactions?.[yearsArray[yearIndex]]?.[mnth]
              )?.filter((val) => {
                return val.category === monthlyEntry.name;
              });

              if (categoryTransactions) {
                spentAmount += categoryTransactions?.reduce(
                  (sum, { amount }) => sum + amount,
                  0
                );
              }
              const findIndex = annualCategoryTransactions.findIndex(
                (el) => el.name === monthlyEntry.name
              );
              if (findIndex === -1) {
                annualCategoryTransactions.push({
                  name: monthlyEntry.name,
                  targetAmount: monthlyEntry.amount ? monthlyEntry.amount : 0,
                  spentAmount: spentAmount ? spentAmount : 0,
                });
              } else {
                annualCategoryTransactions[findIndex]['targetAmount'] +=
                  monthlyEntry.amount;

                annualCategoryTransactions[findIndex]['spentAmount'] +=
                  spentAmount;
              }
            }
          }
        );
      }

      if (monthlyEntries?.[yearsArray[yearIndex]]?.[mnth]) {
        let income = 0;
        let expense = 0;

        if (objectToArray(transactions?.[yearsArray[yearIndex]]?.[mnth])) {
          const expData = objectToArray(
            transactions?.[yearsArray[yearIndex]]?.[mnth]
          )?.filter((tx) => {
            return tx.type === EXPENSE;
          });
          const incomeData = objectToArray(
            transactions?.[yearsArray[yearIndex]]?.[mnth]
          )?.filter((tx) => {
            return tx.type === INCOME;
          });
          expense = expData?.reduce((sum, { amount }) => sum + amount, 0);
          income = incomeData?.reduce((sum, { amount }) => sum + amount, 0);
        }
        setYearlyData((old) => [
          ...old,
          {
            name: mnth,
            income: income,
            expense: expense,
          },
        ]);
        labelsArray.push(mnth);
        dataSetArray.push(income - expense);
      }
    });
    setCategoryWiseData(annualCategoryTransactions);
    setChartLabel(labelsArray);
    setChartDataset(dataSetArray);
    setIsSubmitting(false);
  }, [yearIndex]);

  const onYearChange = (val) => {
    totalSpentAmount = 0;
    totalIncomeAmount = 0;
    setYearlyData([]);
    setCategoryWiseData(null);
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
        {chartLabel &&
          chartLabel.length > 0 &&
          chartDataset &&
          chartDataset.length > 0 && (
            <View>
              <LineChart
                data={{
                  labels: chartLabel,
                  datasets: [
                    {
                      data: chartDataset,
                      color: (opacity = 0.5) =>
                        `rgba(111, 111, 11, ${opacity})`, // optional
                    },
                  ],
                }}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                yAxisLabel='$'
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 12,
                  borderRadius: 8,
                }}
              />
            </View>
          )}
      </View>
      <View style={[styles.form]}>
        {yearlyData && (
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

              return (
                <DataTable.Row style={styles.amount} key={monthlyData.name}>
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
        )}
      </View>
      <View>
        {categoryWiseData && (
          <View style={styles.categoryContainer}>
            <FlatList
              data={categoryWiseData}
              renderItem={({ item }) => <Carousel item={item} />}
              horizontal
              showsHorizontalScrollIndicator={true}
              pagingEnabled
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={32}
              onViewableItemsChanged={viewableItemsChanged}
              ref={slideRef}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default AnnualOverview;
