import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ManageTransaction from './screens/ManageTransaction';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';

import { GlobalStyles } from './constants/styles';

import BudgetsContextProvider, {
    BudgetsContext,
} from './store/budgets-context';
import { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from './components/UI/LoadingOverlay';
import { Provider } from '@react-native-material/core';
import TransactionsOverview from './screens/TransactionsOverview';
const Stack = createNativeStackNavigator();

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
