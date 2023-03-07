import { STARTYEAR, EXPENSE } from './constants';

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
    let startYear = STARTYEAR;
    const currentYear = new Date().getFullYear();
    const years = [];

    while (startYear <= currentYear) {
        years.push(startYear++);
    }
    return years.reverse();
};

export const getMonthsArray = (year = '') => {
    const moment = require('moment');
    const currentYear = moment().year();
    moment.locale('en'); // sets words language (optional if current locale is to be used)
    moment.months(); // returns a list of months in the current locale (January, February, etc.)

    if (year === currentYear) {
        const date = new Date();
        const d = moment(date);
        const currentMonth = d.month();
        return moment
            .monthsShort()
            .splice(0, currentMonth + 1)
            .reverse();
    }
    return moment.monthsShort().reverse();
};

export const getBudgetCategories = (data) => {
    const categoriesArray = [];
    if (data) {
        Object.keys(data)?.filter((key) => {
            return categoriesArray.push(data[key]);
        });
    }
    return categoriesArray;
};

export const categoryDropdown = (options) => {
    const categoriesArray = [];
    options.map((opt) => {
        categoriesArray.push({ id: opt.name, label: opt.name });
    });
    return categoriesArray;
};

export const getMonthAndYear = (date) => {
    const moment = require('moment');
    const dateVal = new Date(date);
    const d = moment(dateVal);
    return { month: d.format('MMM'), year: d.year() };
};
