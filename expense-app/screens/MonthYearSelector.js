import { useEffect, useState } from 'react';
import { GlobalStyles } from '../constants/styles';
import { StyleSheet, View } from 'react-native';
import Select from '../components/ManageTransaction/Select';

function MonthYearSelector({ onSelect, months, years, month, year }) {
    const [yearVal, setYear] = useState(year);
    const [monthVal, setMonth] = useState(month);

    useEffect(() => {
        setMonth(months[0]);
    }, [months]);

    useEffect(() => {
        onSelect(yearVal, monthVal);
    }, [monthVal, yearVal]);

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
                            value: yearVal,
                        }}
                        onChange={changeYear.bind(this)}
                        data={yearsDropdown}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.rowInput}
                        label='Select Month'
                        textInputConfig={{
                            value: monthVal,
                        }}
                        onChange={changeMonth.bind(this)}
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
