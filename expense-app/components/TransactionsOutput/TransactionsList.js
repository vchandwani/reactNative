import { FlatList } from 'react-native';

import TransactionItem from './TransactionItem';

function renderTransactionItem(itemData) {
    return <TransactionItem {...itemData.item} />;
}

function TransactionsList({ transactions, isFocused }) {
    // setListItemsRefresh(!listItemsRefresh);

    return (
        <>
            <FlatList
                data={transactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                extraData={isFocused}
            />
        </>
    );
}

export default TransactionsList;
