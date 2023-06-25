import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import ItemCard from "../components/ItemCard";

const Items = ({ items, setItems }) => {
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!items.length) {
        setLoading(true);
        fetch("https://aah-aah-invoices.onrender.com/item/")
          .then((res) => {
            if (res.status == 200) {
              return res.json();
            }
          })
          .then((res) => {
            setLoading(false);
            setItems(res);
          });
      }

      //   return () => {
      //     alert("Screen was unfocused");
      //     // Useful for cleanup functions
      //   };
    }, [])
  );

  const handleAddItem = () => {
    fetch("https://aah-aah-invoices.onrender.com/item/", {
      method: "POST",
      body: JSON.stringify({
        name: newName,
        price: newPrice,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setNewPrice("");
        setNewName("");
        setItems([...items, res]);
      });
  };

  return (
    <ScrollView>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <View>
            <Text style={{ fontSize: 16, margin: 7 }}>New Item</Text>

            <Text style={{ fontSize: 16, marginLeft: 7 }}>Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
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
            <Text style={{ fontSize: 16, marginLeft: 7 }}>Price</Text>
            <TextInput
              keyboardType="numeric"
              value={newPrice}
              onChangeText={setNewPrice}
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

            <TouchableOpacity
              disabled={!newPrice && !newName}
              onPress={handleAddItem}
              style={{
                backgroundColor: "gray",
                padding: 10,
                margin: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Add new</Text>
            </TouchableOpacity>
          </View>
          {items.map((item, idx) => (
            <ItemCard key={idx} item={item} setItems={setItems} items={items} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Items;
