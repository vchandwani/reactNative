import { useState, useLayoutEffect } from 'react';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
  useWindowDimensions,
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import AllTransactions from './AllTransactions';
import MonthlyOverview from './MonthlyOverview';
import AnnualOverview from './AnnualOverview';
import { GlobalStyles, styles } from '../constants/styles';

function TransactionsOverview({ navigation }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'All Transactions' },
    { key: 'second', title: 'Monthly Overview' },
    { key: 'third', title: 'Annual Overview' },
  ]);

  const renderScene = SceneMap({
    first: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <AllTransactions />
      </ScrollView>
    ),
    second: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>Monthly Overview</Text>
        <MonthlyOverview />
      </ScrollView>
    ),
    third: () => (
      <ScrollView>
        <Text style={styles.headerTitle}>Annual Overview</Text>
        <AnnualOverview />
      </ScrollView>
    ),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: ' Overview',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.rootContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={{
                backgroundColor: GlobalStyles.colors.primary50,
                color: GlobalStyles.colors.font,
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default TransactionsOverview;
