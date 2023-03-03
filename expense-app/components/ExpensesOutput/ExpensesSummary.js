import { View, Text } from 'react-native';

import { styles } from '../../constants/styles';

function ExpensesSummary({ expenses, periodName }) {
    const expensesSum = Object.keys(expenses)?.reduce((sum, expense) => {
        return sum + expenses[expense].amount;
    }, 0);

    return (
        <View style={styles.containerSummary}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={styles.sum}>${expensesSum.toFixed(2)}</Text>
        </View>
    );
}

export default ExpensesSummary;
