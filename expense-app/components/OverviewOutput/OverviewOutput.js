import { Text, View } from 'react-native';

import { styles } from '../../constants/styles';
import { EXPENSE, INCOME } from '../../util/constants';
import { objectToArray } from '../../util/data';
import OverviewList from './OverviewList';
import OverviewSummary from './OverviewSummary';

function OverviewOutput({ categoryWiseData, isFocused, period, fallbackText }) {
    const incomeData = categoryWiseData?.filter((data) => {
        return data.category === INCOME;
    });
    const expenseData = categoryWiseData?.filter((data) => {
        return data.category === EXPENSE;
    });

    let content = <Text style={styles.infoText}>{fallbackText}</Text>;
    let overviewIncomeSummary = null;
    let overviewExpenseSummary = null;

    if (incomeData.length > 0) {
        overviewIncomeSummary = (
            <OverviewList data={incomeData} isFocused={isFocused} />
        );
    }
    if (expenseData.length > 0) {
        overviewExpenseSummary = (
            <OverviewList data={expenseData} isFocused={isFocused} />
        );
    }

    return (
        <View style={styles.container}>
            <OverviewSummary
                incomeData={incomeData}
                expenseData={expenseData}
                periodName={period}
            />
            {overviewIncomeSummary && overviewIncomeSummary}
            {overviewExpenseSummary && overviewExpenseSummary}
            {(!overviewIncomeSummary || !overviewExpenseSummary) && content}
        </View>
    );
}

export default OverviewOutput;
