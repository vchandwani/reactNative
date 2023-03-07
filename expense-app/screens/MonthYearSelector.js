import { useEffect, useState } from 'react';
import { getMonthsArray, getYearsArray } from '../util/data';
import { GlobalStyles } from '../constants/styles';
import { StyleSheet, View } from 'react-native';
import Select from '../components/ManageExpense/Select';

function MonthYearSelector({ onSelect }) {
    const years = getYearsArray();
    const [year, setYear] = useState(years[0]);
    const [months, setMonths] = useState([]);
    const [month, setMonth] = useState(months[0]);

    useEffect(() => {
        setMonths(getMonthsArray(year));
    }, [year]);

    useEffect(() => {
        setMonth(months[0]);
    }, [months]);

    useEffect(() => {
        onSelect(year, month);
    }, [month, year]);

    const yearsDropdown = [];
    const monthsDropdown = [];

    years.map((y) => {
        yearsDropdown.push({ id: y, label: y });
    });
    months.map((m) => {
        monthsDropdown.push({ id: m, label: m });
    });

    const changeYear = (yr) => {
        setYear(yr);
    };

    const changeMonth = (mth) => {
        setMonth(mth);
    };

    return (
        <View style={styles.rootContainer}>
            <View style={styles.form}>
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.rowInput}
                        label='Select Year'
                        textInputConfig={{
                            onChangeText: changeYear.bind(this),
                            value: year,
                        }}
                        data={yearsDropdown}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.rowInput}
                        label='Select Month'
                        textInputConfig={{
                            onChangeText: changeMonth.bind(this),
                            value: month,
                        }}
                        data={monthsDropdown}
                    />
                </View>
            </View>
        </View>
    );
}

export default MonthYearSelector;

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: GlobalStyles.colors.primary800,
    },
    form: {
        marginTop: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },

    rowInput: {
        flex: 1,
    },
});
