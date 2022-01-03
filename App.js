import React, { useState } from "react";
import { StyleSheet, View, FlatList, Button } from "react-native";

import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const addGoalHandler = (goalTitle) => {
    setCourseGoals([
      ...courseGoals,
      { id: Math.random().toString(), value: goalTitle },
    ]);
  };
  const removeGoalHandler = (goalId) => {
    setCourseGoals((currentGoals) => {
      return currentGoals.filter((goal) => goal.id !== goalId);
    });
  };
  const cancelGoalHandler = () => {
    setAddMode(false);
  };

  return (
    <View style={styles.screen}>
      <Button onPress={() => setAddMode(true)} title="Add new Goal"></Button>
      <GoalInput
        visible={addMode}
        onAddGoal={addGoalHandler}
        onCancel={cancelGoalHandler}
      />
      <FlatList
        data={courseGoals}
        renderItem={(itemData) => (
          <GoalItem
            id={itemData.item.id}
            onDelete={removeGoalHandler}
            title={itemData.item.value}
          />
        )}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
});
