import { Text, View } from 'react-native';

import { styles } from '../../constants/styles';
import { objectToArray } from '../../util/data';
import ExpensesList from './ExpensesList';
import ExpensesSummary from './ExpensesSummary';

function ExpensesOutput({
    expenses,
    month,
    year,
    isFocused,
    expensesPeriod,
    fallbackText,
}) {
    let content = <Text style={styles.infoText}>{fallbackText}</Text>;

    if (Object.keys(objectToArray(expenses)).length > 0) {
        content = (
            <ExpensesList
                expenses={objectToArray(expenses)}
                isFocused={isFocused}
            />
        );
    }

    return (
        <View style={styles.container}>
            <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
            {content}
        </View>
    );
}

export default ExpensesOutput;
