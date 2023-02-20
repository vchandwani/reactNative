import { Text, View } from 'react-native';

import { styles } from '../../constants/styles';
import { EXPENSE, INCOME } from '../../util/constants';
import BudgetList from './BudgetList';
import BudgetSummary from './BudgetSummary';

function BudgetOutput({ budgetEntries, fallbackText }) {
    // Budget entries for income and expense
    let budgetIncomeEntries = [];
    let budgetExpenseEntries = [];

    if (budgetEntries) {
        for (const [key, value] of Object.entries(budgetEntries)) {
            if (value.category === INCOME) {
                budgetIncomeEntries.push({
                    ...value,
                    id: key,
                });
            } else if (value.category === EXPENSE) {
                budgetExpenseEntries.push({
                    ...value,
                    id: key,
                });
            }
        }
    }
    let content = <Text style={styles.infoText}>{fallbackText}</Text>;
    let budgetIncomeSummary = null;
    let budgetExpenseSummary = null;

    if (budgetIncomeEntries.length > 0) {
        budgetIncomeSummary = (
            <BudgetList budgetEntries={budgetIncomeEntries} />
        );
    }
    if (budgetExpenseEntries.length > 0) {
        budgetExpenseSummary = (
            <BudgetList budgetEntries={budgetExpenseEntries} />
        );
    }

    return (
        <View style={styles.container}>
            {budgetIncomeEntries.length > 0 && (
                <div>
                    <BudgetSummary
                        budgetEntries={budgetIncomeEntries}
                        periodName='Total'
                    />
                    {budgetIncomeSummary}
                </div>
            )}

            {budgetExpenseEntries.length > 0 && (
                <div>
                    <BudgetSummary
                        budgetEntries={budgetExpenseEntries}
                        periodName='Total'
                    />
                    {budgetExpenseSummary}
                </div>
            )}

            {(!budgetIncomeSummary || !budgetExpenseSummary) && content}
        </View>
    );
}

export default BudgetOutput;
