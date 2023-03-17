import { View, Text } from 'react-native';

import { styles } from '../../constants/styles';

function BudgetSummary({ budgetEntries, periodName }) {
    const budgetEntriesSum = budgetEntries?.reduce((sum, budget) => {
        return sum + budget.amount;
    }, 0);

    return (
        <View style={styles.containerSummary}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={styles.sum}>${budgetEntriesSum.toFixed(2)}</Text>
        </View>
    );
}

export default BudgetSummary;
