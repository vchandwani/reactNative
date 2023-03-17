import { View, Text } from 'react-native';

import { styles } from '../../constants/styles';

function TransactionsSummary({ transactions, periodName }) {
    const transactionsSum = Object.keys(transactions)?.reduce(
        (sum, transaction) => {
            return sum + transactions[transaction].amount;
        },
        0
    );

    return (
        <View style={styles.containerSummary}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={styles.sum}>${transactionsSum.toFixed(2)}</Text>
        </View>
    );
}

export default TransactionsSummary;
