import { useState } from 'react';
import { Text, View } from 'react-native';
import { Switch, Grid } from '@react-native-material/core';

import Select from './Select';
import Input from './Input';
import Button from '../UI/Button';
import { styles } from '../../constants/styles';
import { EXPENSETYPE } from '../../util/constants';

function BudgetForm({
    submitButtonLabel,
    onCancel,
    onSubmit,
    defaultValues,
    budgetInfo,
}) {
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues?.amount?.toString() : 0,
            isValid: true,
        },
        name: {
            value: defaultValues ? defaultValues.name : '',
            isValid: true,
        },
        recurring: {
            value: defaultValues ? defaultValues.recurring : false,
            isValid: true,
        },
        category: {
            value: defaultValues ? defaultValues?.category : EXPENSETYPE[0].id,
            isValid: true,
        },
    });

    function inputChangedHandler(inputIdentifier, enteredValue) {
        setInputs({
            ...inputs,
            [inputIdentifier]: { value: enteredValue, isValid: true },
        });
    }

    function submitHandler() {
        const budgetData = {
            amount: +inputs.amount.value,
            name: inputs.name.value,
            recurring: inputs.recurring.value,
            category: inputs.category.value,
        };

        const amountIsValid =
            !isNaN(budgetData.amount) && budgetData.amount >= 0;
        const nameIsValid = budgetData?.name?.trim().length > 0;
        const categoryIsValid = budgetData?.category?.trim().length > 0;

        if (!amountIsValid || !nameIsValid || !categoryIsValid) {
            setInputs((curInputs) => {
                return {
                    amount: {
                        value: curInputs.amount.value,
                        isValid: amountIsValid,
                    },
                    name: { value: curInputs.name.value, isValid: nameIsValid },
                    recurring: {
                        value: curInputs.recurring.value,
                        isValid: true,
                    },
                    category: {
                        value: curInputs.category.value,
                        isValid: categoryIsValid,
                    },
                };
            });
            return;
        }

        onSubmit(budgetData);
    }

    const formIsInvalid =
        !inputs.amount.isValid ||
        !inputs.name.isValid ||
        !inputs.category.isValid;

    return (
        <View style={(styles.rowItem, { marginTop: 40 })}>
            {budgetInfo && <Text style={styles.header}>{budgetInfo.name}</Text>}
            <View>
                <View style={styles.fieldContainer}>
                    <Input
                        style={styles.flex}
                        label='Name'
                        invalid={!inputs.name.isValid}
                        textInputConfig={{
                            onChangeText: inputChangedHandler.bind(
                                this,
                                'name'
                            ),
                            value: inputs.name.value,
                        }}
                    />
                </View>
                {!inputs.name.isValid && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Please enter value</Text>
                    </View>
                )}
                <View style={styles.fieldContainer}>
                    <Input
                        style={styles.flex}
                        label='Amount'
                        invalid={!inputs.amount.isValid}
                        textInputConfig={{
                            keyboardType: 'decimal-pad',
                            onChangeText: inputChangedHandler.bind(
                                this,
                                'amount'
                            ),
                            value: inputs.amount.value,
                        }}
                    />
                </View>
                {!inputs.amount.isValid && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Please enter value</Text>
                    </View>
                )}
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.flex}
                        label='Category'
                        invalid={!inputs.category.isValid}
                        textInputConfig={{
                            value: inputs.category.value,
                        }}
                        onChange={inputChangedHandler.bind(this, 'category')}
                        data={EXPENSETYPE}
                    />
                </View>
                {!inputs.category.isValid && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Please select value
                        </Text>
                    </View>
                )}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Recurring?</Text>
                    <Switch
                        style={styles.switch}
                        value={inputs.recurring.value}
                        onValueChange={inputChangedHandler.bind(
                            this,
                            'recurring'
                        )}
                    />
                </View>
                {!inputs.recurring.isValid && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Please select value
                        </Text>
                    </View>
                )}
                {formIsInvalid && (
                    <Text style={styles.errorText}>
                        Invalid input values - please check your entered data!
                    </Text>
                )}
                <View style={styles.buttons}>
                    <Button
                        style={styles.button}
                        mode='flat'
                        onPress={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button style={styles.button} onPress={submitHandler}>
                        {submitButtonLabel}
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default BudgetForm;
