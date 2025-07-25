import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DataList from "./screens/DataList";
import DataDetail from "./screens/DataDetail";
import AddTask from "./screens/AddTask";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DataContextProvider from "./store/data-context";
import OverviewWrapper from "./components/OverviewWrapper";
import DropdownMenu from "./components/DropdownMenu";
import Dashboard from "./components/Dashboard";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function TaskOverview() {
  return (
    <OverviewWrapper>
      <BottomTabs.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <BottomTabs.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="stats-chart"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <BottomTabs.Screen
          name="GoalList"
          component={DataList}
          options={{
            title: "Goals",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="flag"
                size={size}
                color={color}
              />
            ),
          }}
          initialParams={{
            data: "goals",
          }}
        />
        <BottomTabs.Screen
          name="TaskList"
          component={DataList}
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="list"
                size={size}
                color={color}
              />
            ),
          }}
          initialParams={{
            data: "tasks",
          }}
        />
        <BottomTabs.Screen
          name="AddTask"
          component={AddTask}
          options={{
            tabBarLabel: "New Task",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-circle"
                size={size}
                color={color}
              />
            ),
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
            options={({ navigation }) => ({
              headerRight: () => {
                return (
                  <DropdownMenu
                    onDuplicate={() => {
                      navigation.setParams({ duplicate: true });
                    }}
                    onDelete={() => {
                      navigation.setParams({ deleteTask: true });
                    }}
                  />
                );
              },
            })}
          >
            {({ route, navigation }) => (
              <DataDetail
                data="task"
                editingObj="editingTask"
                updateEditingObj="updateEditingTask"
                hasManyRelationship="goals"
                deleteObj="deleteTask"
                updateObj="updateTask"
                routeId="taskId"
                route={route}
                navigation={navigation}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="GoalDetail"
            options={({ navigation }) => ({
              headerRight: () => {
                return (
                  <DropdownMenu
                    onDuplicate={() => {
                      navigation.setParams({ duplicate: true });
                    }}
                    onDelete={() => {
                      navigation.setParams({ deleteGoal: true });
                    }}
                  />
                );
              },
            })}
          >
            {({ route, navigation }) => (
              <DataDetail
                data="goal"
                editingObj="editingGoal"
                updateEditingObj="updateEditingGoal"
                hasManyRelationship="tasks"
                deleteObj="deleteGoal"
                deleteObjAndRelationships="deleteGoalWithTasks"
                updateObj="updateGoal"
                routeId="goalId"
                route={route}
                navigation={navigation}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </DataContextProvider>
  );
}
