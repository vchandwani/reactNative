import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { GlobalStyles } from '../../constants/styles';

const DateComponent = ({ label, style, textInputConfig, onDateChange }) => {
  const [date, setDate] = useState(
    textInputConfig.value ? new Date(textInputConfig.value) : new Date()
  );
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onDateChange(currentDate);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <View style={[styles.dateContainer, style]}>
      <Button style={styles.rowInput} onPress={showDatepicker} title={label} />
      {show && (
        <DateTimePicker
          style={styles.rowInput}
          testID='dateTimePicker'
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      {date && (
        <View style={{ height: 40 }}>
          <Text style={[styles.rowInput, styles.input]}>
            Date: {date.toDateString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default DateComponent;

const styles = StyleSheet.create({
  rowInput: {
    flex: 1,
  },
  dateContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: GlobalStyles.colors.font,
    marginBottom: 4,
  },
  input: {
    color: GlobalStyles.colors.font,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
