import React from "react";
import { StyleSheet, View, Button } from "react-native";
import Header from "./components/Header";
import StartGamesScreen from "./screens/StartGamesScreen";

export default function App() {
  return (
    <View style={styles.screen}>
      <Button title="Add"></Button>
      <Header title="Guess a Number"></Header>
      <StartGamesScreen></StartGamesScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
