import { styles } from '../../constants/styles';
import { View } from 'react-native';
import Select from '../UI/Select';

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
