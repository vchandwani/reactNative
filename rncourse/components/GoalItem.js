import { StyleSheet, View, Text, Pressable, Modal } from "react-native";
function GoalItem(props) {
  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.goalItem}>
        <Pressable
          android_ripple={{ color: "#210664" }}
          onPress={props.onDeleteItem.bind(this, props.id)}
          style={(pressed) => pressed && styles.pressedItem}
        >
          <Text style={styles.goalText}>{props.text}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

export default GoalItem;
const styles = StyleSheet.create({
  goalItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: "#5e0acc",
  },
  pressedItem: {
    opacity: 0.5,
  },
  goalText: {
    padding: 8,
    color: "white",
  },
});
