import { View, Text } from 'react-native';

import { styles } from '../../constants/styles';

function OverviewSummary({ incomeData, expenseData, periodName }) {
    const incomeDataSum = incomeData?.reduce(
        (sum, { spentAmount }) => sum + spentAmount,
        0
    );
    const expenseDataSum = expenseData?.reduce(
        (sum, { spentAmount }) => sum + spentAmount,
        0
    );

    return (
        <View style={styles.containerSummary}>
            <Text style={styles.period}>{periodName}</Text>
            <Text style={[styles.sum, styles.green]}>
                ${incomeDataSum.toFixed(2)}
            </Text>
            <Text style={[styles.sum, , styles.red]}>
                ${expenseDataSum.toFixed(2)}
            </Text>
        </View>
    );
}

export default OverviewSummary;
