import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskList from "./screens/TaskList";
import TaskDetail from "./screens/TaskDetail";
import AddTask from "./screens/AddTask";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DataContextProvider from "./store/data-context";
import Action from "./screens/Action";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function TaskOverview() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="FilteredTasks"
        component={TaskList}
        options={{
          title: "Today's Tasks",
        }}
      />
      <BottomTabs.Screen
        name="TaskList"
        component={TaskList}
        options={{
          title: "All Tasks",
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
