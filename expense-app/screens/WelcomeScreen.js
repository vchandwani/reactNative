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
    updateBudget,
    deleteBudget,
    fetchBudget,
} from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Select from '../components/ManageExpense/Select';
import BudgetOutput from '../components/BudgetOutput/BudgetOutput';

function WelcomeScreen({ route, navigation }) {
    const [fetchedMessage, setFetchedMesssage] = useState('');
    const [budgetInfo, setBudgetInfo] = useState({});
    const [allBudgets, setAllBudgets] = useState({});
    const [selectedBudgetId, setSelectedBudgetId] = useState({});
    const [budgetOptions, setBudgetOptions] = useState([]);
    const [notification, setNotification] = useState(null);

    const budgetCtx = useContext(BudgetsContext);
    const token = budgetCtx.token;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const editedBudgetId = route.params?.budgetId;
    const isEditing = !!editedBudgetId;

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
                    defaultValues={null} //TODO:
                    budgetInfo={budgetInfo}
                />
            </View>
        ),
    });

    useEffect(() => {
        axios
            .get(
                'https://react-native-course-624d6-default-rtdb.firebaseio.com/message.json?auth=' +
                    token
            )
            .then((response) => {
                setFetchedMesssage(response.data);
            });
        fetchBudgets();
    }, [token]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Budget Management',
        });
    }, [navigation]);

    useEffect(() => {
        setAllBudgets(budgetCtx.budgets);
    }, [budgetCtx.budgets]);

    useEffect(() => {
        if (allBudgets.length > 0) {
            setSelectedBudgetId(allBudgets[0].id);
            budgetCtx.setBudgets(allBudgets);
            const budgetsOptionsArr = [];
            allBudgets.map((val) => {
                budgetsOptionsArr.push({ id: val.id, label: val.name });
            });
            setBudgetOptions(budgetsOptionsArr);
        }
    }, [allBudgets]);

    useEffect(() => {
        setBudgetInfo(
            budgetCtx.budgets.find((el) => el.id === selectedBudgetId)
        );
        console.log('budgetInfo');
        console.log(budgetInfo);
    }, [selectedBudgetId]);

    async function fetchBudgets() {
        setIsSubmitting(true);
        try {
            const budgets = await fetchBudget('auth=' + token, budgetCtx.email);
            budgetCtx.setBudgets(budgets);
        } catch (error) {
            setError('Something went wrong!');
        }
        setIsSubmitting(false);
    }

    async function deleteBudgetHandler() {
        setIsSubmitting(true);
        try {
            await deleteBudget(editedBudgetId, 'auth=' + budgetCtx.token);
            budgetCtx.deleteBudget(editedBudgetId);
            navigation.goBack();
        } catch (error) {
            setError('Could not delete budget - please try again later!');
            setIsSubmitting(false);
        }
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(budgetData) {
        setIsSubmitting(true);
        try {
            if (isEditing) {
                budgetCtx.updateBudget(editedBudgetId, budgetData);
                await updateBudget(
                    editedBudgetId,
                    budgetData,
                    'auth=' + budgetCtx.token
                );
            } else {
                const id = await storeBudgetEntry(
                    budgetInfo.id,
                    budgetData,
                    'auth=' + budgetCtx.token
                );
                budgetCtx.addBudgetEntry(
                    { ...budgetData, id: id },
                    budgetInfo.id
                );
            }
            setIndex(0);
            setIsSubmitting(false);
            setNotification('Entry successfully added');
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
    function inputChangedHandler(field, enteredValue) {
        setSelectedBudgetId(enteredValue);
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
                    onChangeText: inputChangedHandler.bind(
                        this,
                        'selectedBudgetId'
                    ),
                    value: selectedBudgetId,
                }}
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

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
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
        justifyContent: 'center',
        alignContent: 'center',
        padding: 24,
        flex: 1,
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
});
