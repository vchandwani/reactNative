import BudgetItem from './BudgetItem';

function BudgetList({ budgetEntries }) {
    return budgetEntries.map((entry, i) => {
        return <BudgetItem {...entry} key={entry.id} />;
    });
}

export default BudgetList;
