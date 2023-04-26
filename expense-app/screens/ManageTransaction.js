import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TransactionForm from '../components/ManageTransaction/TransactionForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { BudgetsContext } from '../store/budgets-context';
import { getMonthAndYear } from '../util/data';
import {
    storeTransaction,
    updateTransaction,
    deleteTransaction,
} from '../util/http';

export async function newTransactionHandler(
    budgetId,
    tokenVal,
    finalData,
    month,
    year,
    ctx
) {
    const id = await storeTransaction(
        budgetId,
        finalData,
        'auth=' + tokenVal,
        month,
        year
    );
    ctx.addTransaction(id, { ...finalData, id: id }, budgetId, month, year);
}

export async function updateTransactionHandler(
    budgetId,
    tokenVal,
    editedTransactionId,
    finalData,
    month,
    year,
    ctx
) {
    ctx.updateTransaction(
        editedTransactionId,
        finalData,
        budgetId,
        month,
        year
    );
    await updateTransaction(
        budgetId,
        editedTransactionId,
        finalData,
        'auth=' + tokenVal,
        month,
        year
    );
}

function ManageTransaction({ route, navigation }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const budgetCtx = useContext(BudgetsContext);
    const selectedBudgetId = budgetCtx.selectedBudgetId;

    const editedTransactionId = route.params?.transactionId;
    const editedTransactionDate = route.params?.date;
    const editedMonthDate = getMonthAndYear(editedTransactionDate);

    const isEditing = !!editedTransactionId;

    const transactions = budgetCtx.getTransactions(
        selectedBudgetId,
        editedMonthDate.month,
        editedMonthDate.year
    );
    let selectedTransaction = null;
    if (transactions) {
        Object.keys(transactions).find((tx) => {
            if (tx === editedTransactionId) {
                selectedTransaction = transactions[tx];
            }
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Transaction' : 'Add Transaction',
        });
    }, [navigation, isEditing]);

    async function deleteTransactionHandler(monthVal = null, yearVal = null) {
        setIsSubmitting(true);
        try {
            await deleteTransaction(
                budgetCtx.selectedBudgetId,
                editedTransactionId,
                'auth=' + budgetCtx.token,
                monthVal ? monthVal : editedMonthDate.month,
                yearVal ? yearVal : editedMonthDate.year
            );
            budgetCtx.deleteTransaction(
                editedTransactionId,
                selectedBudgetId,
                monthVal ? monthVal : editedMonthDate.month,
                yearVal ? yearVal : editedMonthDate.year
            );
            !monthVal && !yearVal && navigation.goBack();
        } catch (error) {
            if (error.response.status === 401) {
                budgetCtx.logout();
            }
            setError('Could not delete transaction - please try again later!');
            setIsSubmitting(false);
        }

        setIsSubmitting(false);
    }

    function cancelHandler() {
        navigation.goBack();
    }

    async function confirmHandler(transactionData) {
        setIsSubmitting(true);
        const finalData = { ...transactionData, budgetId: selectedBudgetId };
        if (typeof finalData.date.getMonth === 'function') {
            finalData.date = new Date(finalData.date).toISOString();
        }
        const dataMonthYear = getMonthAndYear(finalData.date);

        try {
            // get Month and Year
            const oldMonthYear =
                selectedTransaction &&
                getMonthAndYear(new Date(selectedTransaction.date));

            // No change in month and year
            if (
                oldMonthYear &&
                dataMonthYear.month === oldMonthYear.month &&
                dataMonthYear.year === oldMonthYear.year
            ) {
                if (isEditing) {
                    updateTransactionHandler(
                        budgetCtx.selectedBudgetId,
                        budgetCtx.token,
                        editedTransactionId,
                        finalData,
                        dataMonthYear.month,
                        dataMonthYear.year,
                        budgetCtx
                    );
                }
            } else {
                if (isEditing) {
                    // Delete previous entry and add new Entry due to change in Date
                    deleteTransactionHandler(
                        oldMonthYear.month,
                        oldMonthYear.year
                    );
                }
                newTransactionHandler(
                    budgetCtx.selectedBudgetId,
                    budgetCtx.token,
                    finalData,
                    dataMonthYear.month,
                    dataMonthYear.year,
                    budgetCtx
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
            <TransactionForm
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                onCancel={cancelHandler}
                defaultValues={selectedTransaction}
            />
            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton
                        icon='trash'
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={() => deleteTransactionHandler(null, null)}
                    />
                </View>
            )}
        </View>
    );
}

export default ManageTransaction;

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
