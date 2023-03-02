import axios from 'axios';
import { useContext, useEffect, useState, useLayoutEffect } from 'react';

import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    Pressable,
} from 'react-native';
import { BudgetsContext } from '../store/budgets-context';
import { GlobalStyles } from '../constants/styles';
import BudgetForm from '../components/ManageExpense/BudgetForm';
import {
    storeBudgetEntry,
    updateBudgetEntry,
    fetchBudget,
    deleteBudgetEntry,
    fetchExpenses,
} from '../util/http';
import { formatBudgetData } from '../util/data';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Select from '../components/ManageExpense/Select';
import BudgetOutput from '../components/BudgetOutput/BudgetOutput';
import IconButton from '../components/UI/IconButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ExpensesOverview } from '../App';
import { ExpensesContext } from '../store/expenses-context';

const BottomTabs = createBottomTabNavigator();

function BudgetData({ route, navigation }) {
    const [fetchedMessage, setFetchedMesssage] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [budgetInfo, setBudgetInfo] = useState({});
    const [budgetOptions, setBudgetOptions] = useState([]);
    const [notification, setNotification] = useState(null);

    const budgetCtx = useContext(BudgetsContext);
    const expCtx = useContext(ExpensesContext);
    const token = budgetCtx.token;
    const selectedBudgetId = budgetCtx.selectedBudgetId;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

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

    const renderScene = SceneMap({
        first: () => (
            <View style={[styles.budgetInfo]}>
                {budgetInfo && (
                    <>
                        <Text style={styles.title}>{budgetInfo.name}</Text>
                        <BudgetOutput
                            budgetEntries={budgetInfo.entries}
                            fallbackText='No data available'
                        />
                    </>
                )}
            </View>
        ),
        second: () => (
            <View style={[styles.budgetInfo]}>
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
        setBudgetInfo(
            budgetCtx.budgets.find((el) => el.id === selectedBudgetId)
        );
        expCtx.setExpenses(budgetInfo.expenses);
    }, [selectedBudgetId]);

    const changeBudget = (id) => {
        budgetCtx.setSelectedBudgetId(id);
    };

    async function fetchBudgets() {
        setIsSubmitting(true);
        try {
            const budgetsData = await fetchBudget(
                'auth=' + token,
                budgetCtx.email
            );
            const formattedData = await formatBudgetData(
                budgetsData,
                budgetCtx.email
            );
            setBudgets(formattedData);
        } catch (error) {
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
                budgetCtx.addBudgetEntry(
                    { ...entryData, id: id },
                    selectedBudgetId
                );
            }
            navigation.navigate('WelcomeScreen', {
                index: 0,
            });
            setIsSubmitting(false);
            setNotification(
                'Entry successfully '.concat(+isEditing ? 'Updated' : 'Added')
            );
        } catch (error) {
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
        return <LoadingOverlay />;
    }

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.description}>{fetchedMessage}</Text>
            {notification && (
                <Pressable onPress={() => setNotification(null)}>
                    <View>
                        <Text style={styles.notificationLabel}>
                            {notification}
                        </Text>
                    </View>
                </Pressable>
            )}
            <Select
                label='Select Budget'
                textInputConfig={{
                    onChangeText: changeBudget.bind(this),
                    value: selectedBudgetId,
                }}
                onCha
                data={budgetOptions}
            />

            <View style={styles.container}>
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
        </View>
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
                                navigation.navigate('ManageExpense');
                            }}
                        />
                        <IconButton
                            icon='cash'
                            size={24}
                            color={tintColor}
                            onPress={() => {
                                navigation.navigate('ExpensesOverview');
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
            <BottomTabs.Screen
                name='ExpensesOverview'
                component={ExpensesOverview}
                options={{
                    title: 'Expenses Overview',
                    tabBarLabel: 'Expenses Overview',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar' size={size} color={color} />
                    ),
                }}
            />
        </BottomTabs.Navigator>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: GlobalStyles.colors.font,
    },
    description: {
        fontSize: 16,
        marginBottom: 8,
        color: GlobalStyles.colors.font,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    budgetInfo: {
        backgroundColor: GlobalStyles.colors.primary800,
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    notificationLabel: {
        color: GlobalStyles.colors.green700,
        backgroundColor: GlobalStyles.colors.green50,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        minHeight: '20px',
        height: 'auto',
        borderRadius: '10px',
        justifyContent: 'center',
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});
