import { FlatList, Text } from "react-native";
import ExpensesItem from "./ExpenseItem";

function renderExpnsesItem(itemData) {
  return <ExpensesItem {...itemData.item} />;
}
function ExpensesList({ expenses }) {
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpnsesItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;
