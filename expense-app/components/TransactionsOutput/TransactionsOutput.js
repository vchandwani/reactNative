import { Text, View } from 'react-native';

import { styles } from '../../constants/styles';
import { objectToArray } from '../../util/data';
import TransactionsList from './TransactionsList';
import TransactionsSummary from './TransactionsSummary';

function TransactionsOutput({
    transactions,
    isFocused,
    transactionsPeriod,
    fallbackText,
}) {
    let content = <Text style={styles.infoText}>{fallbackText}</Text>;
    if (Object.keys(objectToArray(transactions)).length > 0) {
        content = (
            <TransactionsList
                transactions={transactions}
                isFocused={isFocused}
            />
        );
    }

    return (
        <View style={styles.container}>
            <TransactionsSummary
                transactions={transactions}
                periodName={transactionsPeriod}
            />
            {content}
        </View>
    );
}

export default TransactionsOutput;
