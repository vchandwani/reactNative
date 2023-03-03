import { STARTYEAR } from './constants';

export const formatBudgetData = async (data, email) => {
    const budget = [];
    const keys = Object.keys(data);
    await keys.forEach((key, index) => {
        if (email && data[key].users.includes(email)) {
            const budgetObj = {
                id: key,
                entries: data[key].entries ? data[key].entries : [],
                expenses: data[key].expenses ? data[key].expenses : [],

                name: data[key].name,
                users: data[key].users,
            };
            budget.push(budgetObj);
        }
    });

    return budget;
};

export const objectToArray = (data) => {
    const dataArray = [];
    for (let prop of Object.keys(data)) {
        dataArray.push({ ...data[prop], id: prop });
    }
    return dataArray;
};

export const getCurrentYear = () => {
    return new Date().getFullYear;
};

export const getYearsArray = () => {
    const startYear = STARTYEAR;
    const currentYear = new Date().getFullYear();
    const years = [];

    while (startYear <= currentYear) {
        years.push(startYear++);
    }
    return years;
};
