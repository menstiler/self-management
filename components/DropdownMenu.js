// DropdownMenu.js
import { useState } from "react";
import {
  Modal,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DropdownMenu({ onDuplicate, onDelete }) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ padding: 8 }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.menu}>
            <Button
              title="Duplicate Task"
              onPress={() => {
                setVisible(false);
                onDuplicate();
              }}
            />
            <Button
              title="Delete Task"
              color="red"
              onPress={() => {
                setVisible(false);
                onDelete();
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    marginTop: 100,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
