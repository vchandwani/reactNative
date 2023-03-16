import { GlobalStyles } from '../../constants/styles';
import { StyleSheet, View } from 'react-native';
import Select from '../ManageTransaction/Select';

function MonthYearSelector({
    onYearChange,
    onMonthChange,
    yearDefault,
    monthDefault,
    years,
    months,
}) {
    const year = yearDefault ? yearDefault : years[0];
    const month = monthDefault ? monthDefault : months[0];

    const yearsDropdown = [];
    const monthsDropdown = [];

    years.map((y) => {
        yearsDropdown.push({ id: y, label: y });
    });
    months.map((m) => {
        monthsDropdown.push({ id: m, label: m });
    });

    return (
        <View style={styles.rootContainer}>
            <View style={styles.form}>
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.rowInput}
                        label='Select Year'
                        textInputConfig={{
                            value: year,
                        }}
                        onChange={onYearChange.bind(this)}
                        data={yearsDropdown}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Select
                        style={styles.rowInput}
                        label='Select Month'
                        textInputConfig={{
                            value: month,
                        }}
                        onChange={onMonthChange.bind(this)}
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
