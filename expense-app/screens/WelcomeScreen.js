import axios from 'axios';
import { useContext, useEffect, useState, useLayoutEffect } from 'react';

import {
  Text,
  View,
  useWindowDimensions,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { BudgetsContext } from '../store/budgets-context';
import { GlobalStyles, styles } from '../constants/styles';
import BudgetForm from '../components/ManageTransaction/BudgetForm';
import {
  storeBudgetEntry,
  updateBudgetEntry,
  deleteBudgetEntry,
  storeBudgetMonthlyEntry,
} from '../util/http';
import {
  fetchBudgetCall,
  getBudgetCategories,
  getMonthAndYear,
  getRecurringTransactionDate,
  objectToArray,
} from '../util/data';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Select from '../components/UI/Select';
import BudgetOutput from '../components/BudgetOutput/BudgetOutput';
import IconButton from '../components/UI/IconButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { newTransactionHandler } from './ManageTransaction';

const BottomTabs = createBottomTabNavigator();

function BudgetData({ route, navigation }) {
  const [fetchedMessage, setFetchedMesssage] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [budgetInfo, setBudgetInfo] = useState({});
  const [budgetOptions, setBudgetOptions] = useState([]);

  const budgetCtx = useContext(BudgetsContext);
  const token = budgetCtx.token;
  const selectedBudgetId = budgetCtx.selectedBudgetId;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const date = new Date().toISOString();
  const dataMonthYear = getMonthAndYear(date);

  const editedEntriesId = route.params?.entriesId;

  const isEditing = !!editedEntriesId;
  const selectedEntry = editedEntriesId
    ? budgetInfo?.entries[editedEntriesId]
    : null;
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Budget Info' },
    { key: 'second', title: 'Budget Entries' },
  ]);

  let AnimatedHeaderValue = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = 150;
  const HEADER_MIN_HEIGHT = 50;
  const animatedHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: ['transparent', 'transparent'],
    extrapolate: 'clamp',
  });

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const renderScene = SceneMap({
    first: () => (
      <ScrollView
        style={styles.budgetInfo}
        scrollEventThrottle={16}
        onScoll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: AnimatedHeaderValue,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        {budgetInfo && (
          <View style={styles.height100}>
            <Text style={styles.headerTitle}>{budgetInfo.name}</Text>
            <BudgetOutput
              budgetEntries={budgetInfo.entries}
              fallbackText='No data available'
            />
          </View>
        )}
      </ScrollView>
    ),
    second: () => (
      <View style={styles.budgetInfo}>
        <BudgetForm
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          onSubmit={confirmHandler}
          onCancel={cancelHandler}
          defaultValues={selectedEntry}
          budgetInfo={budgetInfo}
        />
        {isEditing && (
          <View style={styles.deleteContainer}>
            <IconButton
              icon='trash'
              color={GlobalStyles.colors.error500}
              size={36}
              onPress={deleteBudgetHandler}
            />
          </View>
        )}
      </View>
    ),
  });

  useEffect(() => {
    setIsSubmitting(true);
    axios
      .get(
        'https://react-native-course-624d6-default-rtdb.firebaseio.com/message.json?auth=' +
          token
      )
      .then((response) => {
        setFetchedMesssage(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          budgetCtx.logout();
        }
      });
    setIsSubmitting(false);
  }, [token]);

  useEffect(() => {
    fetchBudgets();
  }, [budgetCtx.email]);

  useEffect(() => {
    isEditing && setIndex(route?.params?.index);
  }, [route?.params?.index, isEditing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  useEffect(() => {
    if (budgets?.length > 0) {
      budgetCtx.setBudgets(budgets);
      changeBudget(budgets[0].id);
      const budgetsOptionsArr = [];
      budgets.map((val) => {
        budgetsOptionsArr.push({ id: val.id, label: val.name });
      });
      setBudgetOptions(budgetsOptionsArr);
    }
  }, [budgets]);

  useEffect(() => {
    setBudgetInfo(budgetCtx?.budgets?.find((el) => el.id === selectedBudgetId));
  }, [selectedBudgetId]);

  useEffect(() => {
    // Get Categories for Selected Budget
    const categories = getBudgetCategories(budgetInfo?.entries);
    if (categories) {
      budgetCtx.setCurrentBudgetCategories(categories);
    }
  }, [budgetInfo]);

  useEffect(() => {
    if (
      budgetCtx.selectedBudgetId &&
      budgetCtx.currentBudgetCategories &&
      budgetCtx.currentBudgetCategories.length > 0
    ) {
      const { entries, monthlyEntries, transactions } =
        budgetCtx?.budgets?.find((el) => el.id === budgetCtx.selectedBudgetId);

      const formattedEntries = objectToArray(entries);

      if (
        monthlyEntries[dataMonthYear.year][dataMonthYear.month] === undefined
      ) {
        formattedEntries.map((entry) => {
          processRecurringMonthlyEntries(entry, budgetCtx, dataMonthYear);
        }, 100);
      }

      const currentBudgetRecurringCategories =
        budgetCtx.currentBudgetCategories?.filter((btgCat) => {
          return btgCat?.recurring;
        });
      if (transactions[dataMonthYear.year][dataMonthYear.month] === undefined) {
        const dateFormMonthYear = getRecurringTransactionDate(
          dataMonthYear.month,
          dataMonthYear.year
        );
        currentBudgetRecurringCategories.map((budgetCatg) => {
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
          setTimeout(() => {
            newTransactionHandler(
              budgetCtx.selectedBudgetId,
              'auth=' + budgetCtx.token,
              data,
              dateFormMonthYear.month,
              dateFormMonthYear.year,
              budgetCtx
            );
          }, 100);
        });
      }
    }
  }, [budgetCtx.selectedBudgetId, budgetCtx.currentBudgetCategories]);

  const changeBudget = (id) => {
    budgetCtx.setSelectedBudgetId(id);
  };

  async function processRecurringMonthlyEntries(entry, ctx, monthYear) {
    // make monthly entries from base entriesentry
    entry.id = null;
    const id = await storeBudgetMonthlyEntry(
      ctx.selectedBudgetId,
      monthYear.year,
      monthYear.month,
      entry,
      'auth=' + ctx.token
    );
    ctx.addMonthlyEntry(
      id,
      { ...entry, id: id },
      ctx.selectedBudgetId,
      monthYear.month,
      monthYear.year
    );
  }

  async function fetchBudgets() {
    setIsSubmitting(true);
    try {
      const formattedData = await fetchBudgetCall(budgetCtx);
      setBudgets(formattedData);
    } catch (error) {
      if (error.response.status === 401) {
        budgetCtx.logout();
      }
      setError('Something went wrong!');
    }
    setIsSubmitting(false);
  }

  async function deleteBudgetHandler() {
    setIsSubmitting(true);
    try {
      await deleteBudgetEntry(
        editedEntriesId,
        selectedBudgetId,
        'auth=' + budgetCtx.token
      );
      budgetCtx.deleteBudgetEntry(editedEntriesId, selectedBudgetId);
      setIndex(0);
      setIsSubmitting(false);
    } catch (error) {
      if (error.response.status === 401) {
        budgetCtx.logout();
      }
      setError('Could not delete entry - please try again later!');
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    setIndex(0);
    navigation.navigate('WelcomeScreen', {});
  }

  async function confirmHandler(entryData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateBudgetEntry(
          editedEntriesId,
          entryData,
          selectedBudgetId,
          'auth=' + budgetCtx.token
        );
        budgetCtx.updateBudgetEntry(
          editedEntriesId,
          entryData,
          selectedBudgetId
        );
      } else {
        const id = await storeBudgetEntry(
          selectedBudgetId,
          entryData,
          'auth=' + budgetCtx.token
        );
        budgetCtx.addBudgetEntry({ ...entryData, id: id }, selectedBudgetId);
      }
      setIsSubmitting(false);

      navigation.navigate('WelcomeScreen', {
        index: 0,
      });
      setIndex(0);

      showMessage({
        message: 'Entry successfully '.concat(+isEditing ? 'Updated' : 'Added'),
        type: 'success',
      });
    } catch (error) {
      if (error.response.status === 401) {
        budgetCtx.logout();
      }
      setError('Could not save data - please try again later');
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }
  if (isSubmitting) {
    return <LoadingOverlay message='Refreshing' />;
  }

  return (
    <SafeAreaView style={styles.rootContainer}>
      <Animated.View
        style={
          (styles.rootContainer,
          {
            height: animateHeaderHeight,
            backgroundColor: animatedHeaderBackgroundColor,
          })
        }
      >
        <Text style={styles.description}>{fetchedMessage}</Text>

        <Select
          style={styles.budgetSelect}
          label='Select Budget'
          textInputConfig={{
            value: selectedBudgetId,
          }}
          onChange={changeBudget.bind(this)}
          data={budgetOptions}
        />
      </Animated.View>

      <View style={[styles.rootContainer]}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{
                backgroundColor: GlobalStyles.colors.primary800,
                color: GlobalStyles.colors.font,
              }}
            />
          )}
        />
      </View>
      <FlashMessage position='top' />
    </SafeAreaView>
  );
}
function WelcomeScreen({ route, navigation }) {
  const budgetCtx = useContext(BudgetsContext);

  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        headerTintColor: 'white',
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerTitle: 'Budget App',
        headerRight: ({ tintColor }) => (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <IconButton
              icon='home'
              size={24}
              color={tintColor}
              onPress={() => {
                navigation.navigate('WelcomeScreen');
              }}
            />
            <IconButton
              icon='add'
              size={24}
              color={tintColor}
              onPress={() => {
                navigation.navigate('ManageTransaction');
              }}
            />
            <IconButton
              icon='cash'
              size={24}
              color={tintColor}
              onPress={() => {
                navigation.navigate('TransactionsOverview');
              }}
            />

            <IconButton
              icon='exit'
              color={tintColor}
              size={24}
              onPress={budgetCtx.logout}
            />
          </View>
        ),
      })}
    >
      <BottomTabs.Screen
        name='WelcomeScreen'
        component={BudgetData}
        options={{
          title: 'Budget',
          tabBarLabel: 'Budget Info',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='hourglass' size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default WelcomeScreen;
