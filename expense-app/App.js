import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ManageExpense from './screens/ManageExpense';
import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
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

export function ExpensesOverview() {
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
                name='RecentExpenses'
                component={RecentExpenses}
                options={{
                    title: 'Recent Expenses',
                    tabBarLabel: 'Recent',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='hourglass' size={size} color={color} />
                    ),
                }}
            />
            <BottomTabs.Screen
                name='AllExpenses'
                component={AllExpenses}
                options={{
                    title: 'All Transactions',
                    tabBarLabel: 'All Transactions',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar' size={size} color={color} />
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
                name='ExpensesOverview'
                component={ExpensesOverview}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='ManageExpense'
                component={ManageExpense}
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
