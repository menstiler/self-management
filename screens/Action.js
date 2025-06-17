import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { updateFormRef } from "../components/TaskForm";
import { capitalizeWords } from "../util/task";

function Action({ navigation, route }) {
  const action = route.params?.action;

  function Status() {
    const statuses = ["not started", "in progress", "done"];

    function updateStatusHandler(status) {
      updateFormRef.current?.("status", status);
      navigation.goBack();
    }

    return (
      <ScrollView>
        {statuses.map((status, index) => (
          <Pressable
            key={index}
            onPress={() => updateStatusHandler(status)}
          >
            <View>
              <Text>{capitalizeWords(status)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  switch (action) {
    case "status":
      return <Status />;
    default:
      return (
        <View>
          <Text>Can't find any actions</Text>
        </View>
      );
  }
}

export default Action;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
