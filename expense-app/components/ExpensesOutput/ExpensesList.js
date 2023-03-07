import { FlatList } from 'react-native';

import ExpenseItem from './ExpenseItem';

function renderExpenseItem(itemData) {
    return <ExpenseItem {...itemData.item} />;
}

function ExpensesList({ expenses, isFocused }) {
    return (
        <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            extraData={isFocused}
        />
    );
}

export default ExpensesList;
