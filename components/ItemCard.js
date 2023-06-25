import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

const ItemCard = ({ item, setItems, items }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      setItems(items.filter((it) => it._id !== item._id));
      fetch("https://aah-aah-invoices.onrender.com/item/" + item._id, {
        method: "DELETE",
      });
    }
  };

  const handleEditing = () => {
    if (!editing) {
      setEditing(true);
    } else {
      setEditing(false);
      const itemsCopy = items.filter((it) => it._id !== item._id);
      itemsCopy.push({ _id: item._id, name, price });
      setItems(itemsCopy);

      fetch("https://aah-aah-invoices.onrender.com/item/", {
        method: "PATCH",
        body: JSON.stringify({
          _id: item._id,
          name,
          price,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
  };

  return (
    <View
      style={{
        marginVertical: 7,
        padding: 7,
        backgroundColor: "lightgray",
        borderRadius: 10,
      }}
    >
      {editing ? (
        <View>
          <TextInput
            value={name}
            onChangeText={setName}
            style={{
              marginVertical: 7,
              padding: 7,
              backgroundColor: "white",
              marginHorizontal: 7,
              borderRadius: 5,
              borderColor: "lightgray",
              borderWidth: 1,
              fontSize: 16,
            }}
          />
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={{
              marginVertical: 7,
              padding: 7,
              backgroundColor: "white",
              marginHorizontal: 7,
              borderRadius: 5,
              borderColor: "lightgray",
              borderWidth: 1,
              fontSize: 16,
            }}
          />
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 16 }}>{item.name}</Text>
          <Text style={{ fontSize: 16 }}>${item.price}</Text>
        </View>
      )}
      <View
        style={{
          marginTop: 7,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={handleEditing}>
          <Icon name="edit" size={30} color={editing ? "blue" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Icon
            name="trash-o"
            size={30}
            color={confirmDelete ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemCard;
