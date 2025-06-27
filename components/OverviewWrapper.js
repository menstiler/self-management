import { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { DataContext } from "../store/data-context";
import { GOALS, TASKS } from "../data.js";

export default function OverviewWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const dataCtx = useContext(DataContext);

  useEffect(() => {
    setLoading(true);
    try {
      dataCtx.setTasks(TASKS);
      dataCtx.setGoals(GOALS);
    } catch (error) {
      setError("Could not load data");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
