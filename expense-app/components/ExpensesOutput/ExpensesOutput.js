import { Text, View } from 'react-native';

import { styles } from '../../constants/styles';
import { objectToArray } from '../../util/data';
import ExpensesList from './ExpensesList';
import ExpensesSummary from './ExpensesSummary';

function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
    let content = <Text style={styles.infoText}>{fallbackText}</Text>;

    const expensesFormatted = objectToArray(expenses);
    if (Object.keys(expensesFormatted).length > 0) {
        content = <ExpensesList expenses={expensesFormatted} />;
    }

    return (
        <View style={styles.container}>
            <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
            {content}
        </View>
    );
}

export default ExpensesOutput;
