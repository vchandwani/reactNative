import TransactionItem from './TransactionItem';

function TransactionsList({ transactions, isFocused }) {
    // setListItemsRefresh(!listItemsRefresh);
    return transactions.map((entry, i) => {
        return <TransactionItem {...entry} key={entry.date + entry.amount} />;
    });
}

export default TransactionsList;
