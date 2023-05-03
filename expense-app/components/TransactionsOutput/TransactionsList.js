import TransactionItem from './TransactionItem';

function TransactionsList({ transactions, isFocused }) {
  // setListItemsRefresh(!listItemsRefresh);
  return transactions.map((entry, i) => {
    return <TransactionItem {...entry} key={entry.date + entry.description} />;
  });
}

export default TransactionsList;
