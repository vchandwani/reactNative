import { FlatList } from 'react-native';

import BudgetItem from './BudgetItem';

function renderBudgetItem(itemData) {
    return <BudgetItem {...itemData.item} />;
}

function BudgetList({ budgetEntries }) {
    return (
        <FlatList
            data={budgetEntries}
            renderItem={renderBudgetItem}
            keyExtractor={(item) => item.id}
        />
    );
}

export default BudgetList;
