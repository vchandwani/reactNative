import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ManageTransaction from './screens/ManageTransaction';
import AllTransactions from './screens/AllTransactions';
import MonthlyOverview from './screens/MonthlyOverview';
import AnnualOverview from './screens/AnnualOverview';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import { GlobalStyles } from './constants/styles';

import BudgetsContextProvider, {
    BudgetsContext,
} from './store/budgets-context';
import { useContext, useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

export function TransactionsOverview({ navigation }) {
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
            })}
        >
            <BottomTabs.Screen
                name='AllTransactions'
                component={AllTransactions}
                options={{
                    title: 'All Transactions',
                    tabBarLabel: 'All Transactions',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar' size={size} color={color} />
                    ),
                }}
            />
            <BottomTabs.Screen
                name='MonthlyOverview'
                component={MonthlyOverview}
                options={{
                    title: 'Monthly Overview',
                    tabBarLabel: 'Monthly Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='cash-sharp' size={size} color={color} />
                    ),
                }}
            />
            <BottomTabs.Screen
                name='AnnualOverview'
                component={AnnualOverview}
                options={{
                    title: 'Annual Overview',
                    tabBarLabel: 'Annual Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='cash-sharp' size={size} color={color} />
                    ),
                }}
            />
        </BottomTabs.Navigator>
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
                options={{
                    headerShown: false,
                }}
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
        return <AppLoading />;
    }

    return <Navigation />;
}

export default function App() {
    return (
        <>
            <StatusBar style='light' />
            <BudgetsContextProvider>
                <Root />
            </BudgetsContextProvider>
        </>
    );
}
