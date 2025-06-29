import { View, Text, Button, Pressable } from "react-native";
import { capitalizeWords } from "../../util/task";

function RelationshipField({
  dataCtx,
  editingObj,
  updateEditingObj,
  hasManyRelationship,
}) {
  function updateRelationshipHandler(itemId) {
    dataCtx[updateEditingObj]({
      ...dataCtx[editingObj],
      [hasManyRelationship]:
        dataCtx[editingObj][hasManyRelationship].findIndex(
          (item) => item === itemId
        ) !== -1
          ? dataCtx[editingObj][hasManyRelationship].filter(
              (item) => item !== itemId
            )
          : [...dataCtx[editingObj][hasManyRelationship], itemId],
    });
  }

  return (
    <View>
      <Text>{`Related ${capitalizeWords(hasManyRelationship)}`}</Text>
      {dataCtx[editingObj][hasManyRelationship].length < 1 ? (
        <Button
          onPress={() => openAction(hasManyRelationship)}
          title={`Add ${capitalizeWords(hasManyRelationship)}`}
        />
      ) : (
        dataCtx[editingObj][hasManyRelationship].map((item) => {
          // TODO open detail screen on press
          const relationshipItem = dataCtx[hasManyRelationship].find(
            (itemData) => itemData.id === item
          );
          return (
            <View key={relationshipItem.id}>
              <Pressable onPress={() => openAction("tasks")}>
                <Text>{relationshipItem.title}</Text>
              </Pressable>
              <Button
                title={`Remove ${capitalizeWords(
                  hasManyRelationship.slice(0, -1)
                )}`}
                onPress={() => updateRelationshipHandler(relationshipItem.id)}
              />
            </View>
          );
        })
      )}
    </View>
  );
}

export default RelationshipField;
