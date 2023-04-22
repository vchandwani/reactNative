import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ManageTransaction from './screens/ManageTransaction';
import AllTransactions from './screens/AllTransactions';
import MonthlyOverview from './screens/MonthlyOverview';
import AnnualOverview from './screens/AnnualOverview';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import { GlobalStyles, styles } from './constants/styles';

import BudgetsContextProvider, {
  BudgetsContext,
} from './store/budgets-context';
import { useContext, useState, useEffect, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from './components/UI/LoadingOverlay';
import { Provider } from '@react-native-material/core';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions, View, Text, ScrollView } from 'react-native';
const Stack = createNativeStackNavigator();

export function TransactionsOverview({ navigation }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'All Transactions' },
    { key: 'second', title: 'Monthly Overview' },
    { key: 'third', title: 'Annual Overview' },
  ]);

  const renderScene = SceneMap({
    first: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <AllTransactions />
      </ScrollView>
    ),
    second: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>Monthly Overview</Text>
        <MonthlyOverview />
      </ScrollView>
    ),
    third: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>Annual Overview</Text>
        <AnnualOverview />
      </ScrollView>
    ),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ' Overview',
    });
  }, [navigation]);

  return (
    <View style={styles.rootContainer}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: GlobalStyles.colors.primary50,
              color: GlobalStyles.colors.font,
            }}
          />
        )}
      />
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        headerTintColor: 'white',
        contentStyle: {
          backgroundColor: GlobalStyles.colors.primary100,
        },
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        headerTintColor: 'white',
        contentStyle: {
          backgroundColor: GlobalStyles.colors.primary100,
        },
      }}
    >
      <Stack.Screen
        name='Welcome Screen'
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='TransactionsOverview'
        component={TransactionsOverview}
      />
      <Stack.Screen
        name='ManageTransaction'
        component={ManageTransaction}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const budgetCtx = useContext(BudgetsContext);
  return (
    <NavigationContainer>
      {!budgetCtx.isAuthenticated && <AuthStack />}
      {budgetCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const budgetCtx = useContext(BudgetsContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedEmail = await AsyncStorage.getItem('email');

      if (storedToken) {
        budgetCtx.authenticate(storedToken, storedEmail);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <LoadingOverlay />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style='light' />
      <BudgetsContextProvider>
        <Provider>
          <Root />
        </Provider>
      </BudgetsContextProvider>
    </>
  );
}
