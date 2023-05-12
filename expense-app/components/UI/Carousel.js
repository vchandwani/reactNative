import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { styles } from '../../constants/styles';

const Carousel = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[{ width }]}>
      <View
        style={[
          item.targetAmount < item.spentAmount
            ? styles.redBackgroundLight
            : styles.greenBackgroundLight,
          styles.categoryContainer,
          { width },
        ]}
      >
        <View style={styles.centerAligned}>
          <Text style={[styles.textBase]}>{item.name}</Text>
        </View>
        <View
          style={[
            styles.centerAligned,
            {
              flexDirection: 'column',
            },
          ]}
        >
          <Text style={[styles.textBase]}>Target Amount</Text>
          <Text style={[styles.textBase, styles.bold]}>
            {item.targetAmount?.toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            styles.centerAligned,
            {
              flexDirection: 'column',
            },
          ]}
        >
          <Text style={[styles.textBase]}>Spent Amount</Text>
          <Text style={[styles.textBase, styles.bold]}>
            {item.spentAmount?.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Carousel;
