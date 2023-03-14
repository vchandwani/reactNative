import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Input from './Input';
import DateComponent from './Date';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';
import { BudgetsContext } from '../../store/budgets-context';
import Select from './Select';
import { categoryDropdown } from '../../util/data';
import { EXPENSETYPE } from '../../util/constants';

function TransactionForm({
    submitButtonLabel,
    onCancel,
    onSubmit,
    defaultValues,
}) {
    const budgetCtx = useContext(BudgetsContext);
    const currentBudgetCategories = budgetCtx.currentBudgetCategories;

    const categoryArray = categoryDropdown(currentBudgetCategories);

    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
            isValid: true,
        },
        type: {
            value:
                defaultValues && defaultValues?.type
                    ? defaultValues?.type.toString()
                    : EXPENSETYPE[0].id,
            isValid: true,
        },
        category: {
            value:
                defaultValues && defaultValues?.category
                    ? defaultValues?.category.toString()
                    : null,
            isValid: true,
        },
        date: {
            value: defaultValues
                ? getFormattedDate(new Date(defaultValues.date))
                : new Date(),
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true,
        },
        email: {
            value: defaultValues ? defaultValues.email : budgetCtx.email,
            isValid: true,
        },
    });

    function inputChangedHandler(inputIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return {
                ...curInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true },
            };
        });
    }
    function dateChangedHandler(dateIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return {
                ...curInputs,
                [dateIdentifier]: {
                    value: enteredValue,
                    isValid: true,
                },
            };
        });
    }

    function submitHandler() {
        const transactionData = {
            amount: +inputs.amount.value,
            type: inputs.type.value,
            category: inputs.category.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value,
            email: budgetCtx.email,
        };

        const amountIsValid =
            !isNaN(transactionData.amount) && transactionData.amount > 0;
        const dateIsValid = transactionData.date.toString() !== 'Invalid Date';
        const descriptionIsValid =
            transactionData.description.trim().length > 0;
        const typeIsValid = transactionData?.type?.trim().length > 0;
        const categoryIsValid = transactionData?.category?.trim().length > 0;

        if (
            !amountIsValid ||
            !dateIsValid ||
            !descriptionIsValid ||
            !categoryIsValid ||
            !typeIsValid
        ) {
            setInputs((curInputs) => {
                return {
                    amount: {
                        value: curInputs.amount.value,
                        isValid: amountIsValid,
                    },
                    date: { value: curInputs.date.value, isValid: dateIsValid },
                    description: {
                        value: curInputs.description.value,
                        isValid: descriptionIsValid,
                    },
                    category: {
                        value: curInputs.category.value,
                        isValid: categoryIsValid,
                    },
                    type: {
                        value: curInputs.type.value,
                        isValid: typeIsValid,
                    },
                };
            });
            return;
        }

        onSubmit(transactionData);
    }

    const formIsInvalid =
        !inputs.amount.isValid ||
        !inputs.date.isValid ||
        !inputs.description.isValid ||
        !inputs.category.isValid ||
        !inputs.type.isValid;

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Transaction</Text>
            <Input
                style={styles.rowInput}
                label='Amount'
                invalid={!inputs.amount.isValid}
                textInputConfig={{
                    keyboardType: 'decimal-pad',
                    onChangeText: inputChangedHandler.bind(this, 'amount'),
                    value: inputs.amount.value,
                }}
            />
            <Select
                style={styles.rowInput}
                label='Type'
                invalid={!inputs.type.isValid}
                textInputConfig={{
                    value: inputs.type.value,
                }}
                onChange={inputChangedHandler.bind(this, 'type')}
                data={EXPENSETYPE}
            />
            <Select
                style={styles.rowInput}
                label='Category'
                invalid={!inputs.category.isValid}
                textInputConfig={{
                    value: inputs.category.value,
                }}
                onChange={inputChangedHandler.bind(this, 'category')}
                data={categoryArray}
            />

            <DateComponent
                style={styles.rowInput}
                label='Date'
                invalid={!inputs.date.isValid}
                textInputConfig={{
                    onChangedate: dateChangedHandler.bind(this, 'date'),
                    value: inputs.date.value,
                }}
            />

            <Input
                label='Description'
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    // autoCapitalize: 'none'
                    // autoCorrect: false // default is true
                    onChangeText: inputChangedHandler.bind(this, 'description'),
                    value: inputs.description.value,
                }}
            />
            {formIsInvalid && (
                <Text style={styles.errorText}>
                    Invalid input values - please check your entered data!
                </Text>
            )}
            <View style={styles.buttons}>
                <Button style={styles.button} mode='flat' onPress={onCancel}>
                    Cancel
                </Button>
                <Button style={styles.button} onPress={submitHandler}>
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    );
}

export default TransactionForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GlobalStyles.colors.font,
        marginVertical: 24,
        textAlign: 'center',
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput: {
        flex: 1,
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        margin: 8,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginHorizontal: 8,
    },
});