import { useContext, useState } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import Input from './Input';
import DateComponent from './Date';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { styles } from '../../constants/styles';
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
    const descriptionIsValid = transactionData.description.trim().length > 0;
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
    <ScrollView style={styles.flex}>
      <KeyboardAvoidingView behavior='padding' style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Your Transaction</Text>
            <Input
              label='Amount'
              invalid={!inputs.amount.isValid}
              textInputConfig={{
                keyboardType: 'decimal-pad',
                onChangeText: inputChangedHandler.bind(this, 'amount'),
                value: inputs.amount.value,
              }}
            />
            <Select
              label='Type'
              invalid={!inputs.type.isValid}
              textInputConfig={{
                value: inputs.type.value,
              }}
              onChange={inputChangedHandler.bind(this, 'type')}
              data={EXPENSETYPE}
            />
            <Select
              label='Category'
              invalid={!inputs.category.isValid}
              textInputConfig={{
                value: inputs.category.value,
              }}
              onChange={inputChangedHandler.bind(this, 'category')}
              data={categoryArray}
            />
            <DateComponent
              label='Date'
              invalid={!inputs.date.isValid}
              textInputConfig={{
                value: inputs.date.value,
              }}
              onDateChange={dateChangedHandler.bind(this, 'date')}
            />
            <Input
              label='Description'
              invalid={!inputs.description.isValid}
              style={{ marginBottom: 20 }}
              textInputConfig={{
                multiline: true,
                // autoCapitalize: 'none'
                // autoCorrect: false // default is true
                onChangeText: inputChangedHandler.bind(this, 'description'),
                value: inputs.description.value,
              }}
            />
            <View>
              {formIsInvalid && (
                <Text style={styles.errorText}>
                  Invalid input values - please check your entered data!
                </Text>
              )}
            </View>
            <View style={styles.buttons}>
              <Button style={styles.button} mode='flat' onPress={onCancel}>
                Cancel
              </Button>
              <Button style={styles.button} onPress={submitHandler}>
                {submitButtonLabel}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default TransactionForm;
