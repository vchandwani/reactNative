import axios from 'axios';
import { useContext, useEffect, useState, useLayoutEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { BudgetsContext } from '../store/budgets-context';
import { GlobalStyles } from '../constants/styles';
import BudgetForm from '../components/ManageExpense/BudgetForm';
import {
    storeBudget,
    updateBudget,
    deleteBudget,
    fetchBudget,
} from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function WelcomeScreen({ route, navigation }) {
    const [fetchedMessage, setFetchedMesssage] = useState('');

    const budgetCtx = useContext(BudgetsContext);
    const token = budgetCtx.token;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const editedBudgetId = route.params?.budgetId;
    const isEditing = !!editedBudgetId;

    const selectedBudget = budgetCtx.budgets.find(
        (budget) => budget.id === editedBudgetId
    );

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
            title: isEditing ? 'Edit Budget' : 'Add Budget',
        });
    }, [navigation, isEditing]);

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
                const id = await storeBudget(
                    budgetData,
                    'auth=' + budgetCtx.token
                );
                budgetCtx.addBudget({ ...budgetData, id: id });
            }
            navigation.goBack();
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
            <View style={styles.container}>
                <BudgetForm
                    submitButtonLabel={isEditing ? 'Update' : 'Add'}
                    onSubmit={confirmHandler}
                    onCancel={cancelHandler}
                    defaultValues={selectedBudget}
                />
            </View>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
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
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
});
