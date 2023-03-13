import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import TransactionItem from './TransactionItem';

function renderTransactionItem(itemData) {
    return <TransactionItem {...itemData.item} />;
}

function TransactionsList({ transactions, isFocused }) {
    const [listItemsRefresh, setListItemsRefresh] = useState(isFocused);
    // setListItemsRefresh(!listItemsRefresh);

    useEffect(() => {
        console.log('isFocused');
        console.log(isFocused);
    }, [isFocused]);

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
