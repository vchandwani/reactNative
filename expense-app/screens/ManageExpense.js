import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { BudgetsContext } from '../store/budgets-context';
import { getMonthAndYear } from '../util/data';
import { storeExpense, updateExpense, deleteExpense } from '../util/http';

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const budgetCtx = useContext(BudgetsContext);
    const selectedBudgetId = budgetCtx.selectedBudgetId;

    const editedExpenseId = route.params?.expenseId;
    const editedExpenseDate = route.params?.date;
    const editedMonthDate = getMonthAndYear(editedExpenseDate);

    const isEditing = !!editedExpenseId;

    const expenses = budgetCtx.getExpenses(
        selectedBudgetId,
        editedMonthDate.month,
        editedMonthDate.year
    );
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

    async function deleteExpenseHandler(monthVal = null, yearVal = null) {
        setIsSubmitting(true);
        try {
            await deleteExpense(
                budgetCtx.selectedBudgetId,
                editedExpenseId,
                'auth=' + budgetCtx.token,
                monthVal ? monthVal : editedMonthDate.month,
                yearVal ? yearVal : editedMonthDate.year
            );
            budgetCtx.deleteExpense(
                editedExpenseId,
                selectedBudgetId,
                monthVal ? monthVal : editedMonthDate.month,
                yearVal ? yearVal : editedMonthDate.year
            );
            !monthVal && !yearVal && navigation.goBack();
        } catch (error) {
            if (error.response.status === 401) {
                budgetCtx.logout();
            }
            setError('Could not delete expense - please try again later!');
            setIsSubmitting(false);
        }

        setIsSubmitting(false);
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
        const dataMonthYear = getMonthAndYear(finalData.date);

        try {
            // get Month and Year
            const oldMonthYear =
                selectedExpense &&
                getMonthAndYear(new Date(selectedExpense.date));

            // No change in month and year
            if (
                oldMonthYear &&
                dataMonthYear.month === oldMonthYear.month &&
                dataMonthYear.year === oldMonthYear.year
            ) {
                if (isEditing) {
                    budgetCtx.updateExpense(
                        editedExpenseId,
                        finalData,
                        selectedBudgetId,
                        dataMonthYear.month,
                        dataMonthYear.year
                    );
                    await updateExpense(
                        budgetCtx.selectedBudgetId,
                        editedExpenseId,
                        finalData,
                        'auth=' + budgetCtx.token,
                        dataMonthYear.month,
                        dataMonthYear.year
                    );
                }
            } else {
                if (isEditing) {
                    // Delete previous entry and add new Entry
                    deleteExpenseHandler(oldMonthYear.month, oldMonthYear.year);
                }
                const id = await storeExpense(
                    budgetCtx.selectedBudgetId,
                    finalData,
                    'auth=' + budgetCtx.token,
                    dataMonthYear.month,
                    dataMonthYear.year
                );
                budgetCtx.addExpense(
                    id,
                    { ...finalData, id: id },
                    selectedBudgetId,
                    dataMonthYear.month,
                    dataMonthYear.year
                );
            }
            navigation.goBack();
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
                        onPress={() => deleteExpenseHandler(null, null)}
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
