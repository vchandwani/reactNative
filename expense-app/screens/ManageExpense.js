import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { BudgetsContext } from '../store/budgets-context';
import { storeExpense, updateExpense, deleteExpense } from '../util/http';

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const budgetCtx = useContext(BudgetsContext);
    const selectedBudgetId = budgetCtx.selectedBudgetId;

    const editedExpenseId = route.params?.expenseId;
    const isEditing = !!editedExpenseId;

    const expenses = budgetCtx.getExpenses(selectedBudgetId);
    let selectedExpense = null;
    if (expenses) {
        Object.keys(expenses).find((expense) => {
            if (expense === editedExpenseId) {
                selectedExpense = expenses[expense];
            }
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense',
        });
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try {
            await deleteExpense(
                budgetCtx.selectedBudgetId,
                editedExpenseId,
                'auth=' + budgetCtx.token
            );
            budgetCtx.deleteExpense(editedExpenseId, selectedBudgetId);
            navigation.goBack();
        } catch (error) {
            setError('Could not delete expense - please try again later!');
            setIsSubmitting(false);
        }

        // setIsSubmitting(false);
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        const finalData = { ...expenseData, budgetId: selectedBudgetId };
        if (typeof finalData.date.getMonth === 'function') {
            finalData.date = new Date(finalData.date).toISOString();
        }
        try {
            if (isEditing) {
                budgetCtx.updateExpense(
                    editedExpenseId,
                    finalData,
                    selectedBudgetId
                );
                await updateExpense(
                    budgetCtx.selectedBudgetId,
                    editedExpenseId,
                    finalData,
                    'auth=' + budgetCtx.token
                );
            } else {
                const id = await storeExpense(
                    budgetCtx.selectedBudgetId,
                    finalData,
                    'auth=' + budgetCtx.token
                );
                budgetCtx.addExpense(
                    id,
                    { ...finalData, id: id },
                    selectedBudgetId
                );
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
        <View style={styles.container}>
            <ExpenseForm
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                onCancel={cancelHandler}
                defaultValues={selectedExpense}
            />
            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton
                        icon='trash'
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={deleteExpenseHandler}
                    />
                </View>
            )}
        </View>
    );
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});
