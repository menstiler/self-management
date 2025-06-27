import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskList from "./screens/TaskList";
import GoalList from "./screens/GoalList";
import TaskDetail from "./screens/TaskDetail";
import GoalDetail from "./screens/GoalDetail";
import AddTask from "./screens/AddTask";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DataContextProvider from "./store/data-context";
import Action from "./screens/Action";
import OverviewWrapper from "./components/OverviewWrapper";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function TaskOverview() {
  return (
    <OverviewWrapper>
      <BottomTabs.Navigator>
        <BottomTabs.Screen
          name="GoalList"
          component={GoalList}
          options={{
            title: "Goals",
          }}
        />
        <BottomTabs.Screen
          name="TaskList"
          component={TaskList}
          options={{
            title: "Tasks",
          }}
        />
        <BottomTabs.Screen
          name="AddTask"
          component={AddTask}
          options={{
            tabBarLabel: "New Task",
          }}
        />
      </BottomTabs.Navigator>
    </OverviewWrapper>
  );
}

export default function App() {
  return (
    <DataContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="TaskOverview"
            component={TaskOverview}
            options={{
              headerShown: false,
              title: "All Tasks",
            }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetail}
          />
          <Stack.Screen
            name="GoalDetail"
            component={GoalDetail}
          />
          <Stack.Screen
            name="Action"
            component={Action}
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: "fitToContents",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContextProvider>
  );
}
