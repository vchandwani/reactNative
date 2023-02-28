export const formatBudgetData = async (data, email) => {
    const budget = [];
    const keys = Object.keys(data);
    await keys.forEach((key, index) => {
        if (email && data[key].users.includes(email)) {
            const budgetObj = {
                id: key,
                entries: data[key].entries ? data[key].entries : [],

                name: data[key].name,
                users: data[key].users,
            };
            budget.push(budgetObj);
        }
    });

    return budget;
};
