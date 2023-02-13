import { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    CheckBox,
    useWindowDimensions,
    TouchableOpacity,
    Animated,
    StatusBar,
    Dimensions,
} from 'react-native';

import Select from './Select';
import Input from './Input';
import Button from '../UI/Button';
import { GlobalStyles } from '../../constants/styles';
import { BudgetsContext } from '../../store/budgets-context';
import { EXPENSETYPE } from '../../util/constants';

function BudgetForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
    const [budgetInfo, setBudgetInfo] = useState({});

    const budgetCtx = useContext(BudgetsContext);
    const [inputs, setInputs] = useState({
        amount: {
            value: defaultValues ? defaultValues.amount.toString() : '',
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
            value: defaultValues ? defaultValues.category : EXPENSETYPE.expense,
            isValid: true,
        },
    });

    useEffect(() => {
        setBudgetInfo(budgetCtx.budgets[0]);
    }, [budgetCtx.budgets]);

    function inputChangedHandler(inputIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return {
                ...curInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true },
            };
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
            !isNaN(budgetData.amount) && budgetData.amount > 0;
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
        <View style={styles.form}>
            {budgetInfo && <Text style={styles.title}>{budgetInfo.name}</Text>}
            <View style={styles.fieldContainer}>
                <Input
                    style={styles.container}
                    label='Name'
                    invalid={!inputs.name.isValid}
                    textInputConfig={{
                        onChangeText: inputChangedHandler.bind(this, 'name'),
                        value: inputs.name.value,
                    }}
                />
                {!inputs.name.isValid && (
                    <Text style={styles.errorText}>Please enter value</Text>
                )}
            </View>
            <View style={styles.fieldContainer}>
                <Input
                    style={styles.container}
                    label='Amount'
                    invalid={!inputs.amount.isValid}
                    textInputConfig={{
                        keyboardType: 'decimal-pad',
                        onChangeText: inputChangedHandler.bind(this, 'amount'),
                        value: inputs.amount.value,
                    }}
                />
                {!inputs.amount.isValid && (
                    <Text style={styles.errorText}>Please enter value</Text>
                )}
            </View>
            <View style={styles.fieldContainer}>
                <Select
                    style={styles.container}
                    label='Category'
                    invalid={!inputs.category.isValid}
                    textInputConfig={{
                        onChangeText: inputChangedHandler.bind(
                            this,
                            'category'
                        ),
                        value: inputs.category.value,
                    }}
                    data={EXPENSETYPE}
                />
                {!inputs.category.isValid && (
                    <Text style={styles.errorText}>Please select value</Text>
                )}
            </View>
            <View style={styles.fieldContainer}>
                <CheckBox
                    style={styles.checkbox}
                    value={inputs.recurring.value}
                    onValueChange={inputChangedHandler.bind(this, 'recurring')}
                />
                <Text style={styles.label}>Recurring?</Text>

                {!inputs.recurring.isValid && (
                    <Text style={styles.errorText}>Please select value</Text>
                )}
            </View>
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

export default BudgetForm;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    container: {
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
    fieldContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },
    label: {
        fontSize: 12,
        color: GlobalStyles.colors.font,
        marginBottom: 4,
        marginLeft: 4,
    },
    checkbox: {
        alignSelf: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        paddingTop: StatusBar.currentHeight,
        color: 'black',
        backgroundColor: 'white',
        font: '20px',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        color: 'red',
        font: '20px',
    },
});
