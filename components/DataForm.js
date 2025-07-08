import {
  useEffect,
  useContext,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { TextInput, View, Text, Button, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context.js";
import { capitalizeWords } from "../util/task.js";
import DateField from "./form/DateField";
import PriorityField from "./form/PriorityField";
import DurationField from "./form/DurationField";
import RelationshipField from "./form/RelationshipField";
import DeleteModal from "./form/DeleteModal";
import Checkbox from "expo-checkbox";
import * as Progress from "react-native-progress";

const DataForm = forwardRef(
  (
    {
      data,
      item,
      hasManyRelationship,
      editingObj,
      updateEditingObj,
      onSave,
      onCancel,
      onDelete,
      onDeleteItemAndRelationships,
    },
    ref
  ) => {
    const dataCtx = useContext(DataContext);
    const navigation = useNavigation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tasksToDelete, setTasksToDelete] = useState([]);

    function updateInputHandler(input, value) {
      dataCtx[updateEditingObj]({ ...dataCtx[editingObj], [input]: value });
    }

    function updateDateHandler(_, date) {
      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [data === "task" ? "date" : "deadline"]: date,
      });
    }

    function saveHandler() {
      onSave();
    }

    function cancelHandler() {
      dataCtx[updateEditingObj](item);
      onCancel();
    }

    function openAction(action) {
      navigation.navigate("Action", {
        action: action,
      });
    }

    function deleteHandler() {
      onDelete(dataCtx[editingObj].id);
      navigation.goBack();
    }

    function deleteGoalWithTasksHandler() {
      onDeleteItemAndRelationships(dataCtx[editingObj].id);
      navigation.goBack();
    }

    function calculateGoalProgress(goalTasks) {
      if (goalTasks.length === 0) return 0;
      const completed = goalTasks.filter(
        (task) => task.status === "done"
      ).length;
      return completed / goalTasks.length;
    }

    useEffect(() => {
      if (data === "goal") {
        const allTasks = dataCtx.tasks || [];

        const goalTasks = allTasks.filter((task) =>
          (item.tasks || []).includes(task.id)
        );

        const uniqueGoalTasks = goalTasks.filter(
          (task) => task.goals.length === 1
        );

        setTasksToDelete(uniqueGoalTasks);

        let progress = calculateGoalProgress(goalTasks);

        if (dataCtx[editingObj].progress !== progress) {
          dataCtx[updateEditingObj]({
            ...dataCtx[editingObj],
            progress,
          });
        }

        if (dataCtx[editingObj].trackTaskStatus) {
          const anyTaskInProgressOrDone = goalTasks.some(
            (task) => task.status === "in progress" || task.status === "done"
          );

          const allTasksComplete =
            goalTasks.length > 0 &&
            goalTasks.every((task) => task.status === "done");

          let goalStatus = "";
          if (allTasksComplete) {
            goalStatus = "done";
          } else if (anyTaskInProgressOrDone) {
            goalStatus = "in progress";
          } else {
            goalStatus = "not started";
          }

          if (dataCtx[editingObj].status !== goalStatus) {
            dataCtx[updateEditingObj]({
              ...dataCtx[editingObj],
              status: goalStatus,
            });
          }
        }
      }
    }, [data, editingObj, updateEditingObj, dataCtx]);

    function duplicateTaskHandler() {
      if (data !== "task") return;

      const baseTitle = dataCtx[editingObj].title.replace(/\s\(\d+\)$/, "");
      const similarTasks = dataCtx.tasks.filter((task) =>
        task.title.startsWith(baseTitle)
      );

      let maxNum = 0;
      similarTasks.forEach((task) => {
        const match = task.title.match(/\((\d+)\)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const newNum = maxNum + 1;

      const newTask = {
        ...dataCtx[editingObj],
        id: Math.random().toString(),
        title: `${baseTitle} (${newNum})`,
      };

      dataCtx.addTask(newTask);
      navigation.navigate("TaskDetail", {
        taskId: newTask.id,
      });
    }

    useImperativeHandle(ref, () => ({
      duplicateTask: duplicateTaskHandler,
    }));

    return (
      <View>
        <View>
          <Text>Title</Text>
          <TextInput
            onChangeText={(value) => updateInputHandler("title", value)}
            value={dataCtx[editingObj].title}
          />
        </View>
        <View>
          <View>
            <Text>Status</Text>
            <Pressable
              onPress={() => {
                if (data === "goal" && dataCtx[editingObj].trackTaskStatus)
                  return;
                openAction(data === "task" ? "task-status" : "goal-status");
              }}
            >
              <Text>{capitalizeWords(dataCtx[editingObj].status)}</Text>
            </Pressable>
          </View>
          {data === "goal" && (
            <View>
              <Checkbox
                value={dataCtx[editingObj].trackTaskStatus}
                onValueChange={(value) =>
                  updateInputHandler("trackTaskStatus", value)
                }
              />
            </View>
          )}
        </View>
        {data === "goal" && (
          <View style={{ marginVertical: 16 }}>
            <Text>
              Progress: {Math.round(dataCtx[editingObj].progress * 100)}%
            </Text>
            <Progress.Bar
              progress={dataCtx[editingObj].progress}
              width={null}
              height={10}
              color="#4caf50"
              unfilledColor="#e0e0e0"
              borderWidth={0}
            />
          </View>
        )}
        <RelationshipField
          hasManyRelationship={hasManyRelationship}
          dataCtx={dataCtx}
          editingObj={editingObj}
          updateEditingObj={updateEditingObj}
          openAction={openAction}
        />
        {data === "task" && (
          <>
            <PriorityField
              value={dataCtx[editingObj].priority}
              updateInputHandler={updateInputHandler}
            />
            <DurationField
              durationValue={dataCtx[editingObj].duration}
              dataCtx={dataCtx}
            />
          </>
        )}
        <DateField
          data={data}
          value={dataCtx[editingObj][data === "task" ? "date" : "deadline"]}
          updateDateHandler={updateDateHandler}
        />
        <View>
          <TextInput
            onChangeText={(value) => updateInputHandler("description", value)}
            value={dataCtx[editingObj].description}
          />
        </View>
        <View>
          <Button
            title="Save"
            onPress={saveHandler}
          />
          <Button
            title="Cancel"
            onPress={cancelHandler}
          />
        </View>
        {dataCtx[editingObj].id && (
          <View>
            <Button
              title={`Delete ${capitalizeWords(data)}`}
              onPress={() => setShowDeleteModal(true)}
              color="red"
            />
          </View>
        )}
        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            deleteHandler();
            setShowDeleteModal(false);
          }}
          onDeleteWithTasks={() => {
            deleteGoalWithTasksHandler();
            setShowDeleteModal(false);
          }}
          itemTitle={dataCtx[editingObj].title}
          itemType={data}
          tasksToDelete={tasksToDelete}
        />
      </View>
    );
  }
);

export default DataForm;
