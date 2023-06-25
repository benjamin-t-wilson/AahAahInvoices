import {
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import Icon from "react-native-vector-icons/FontAwesome";

const NewOrder = ({ items, setItems, navigation, orders, setOrders }) => {
  const [loading, setLoading] = useState(false);
  const [newOrderDetails, setNewOrderDetails] = useState({});
  const [readyForSubmission, setReadyForSubmission] = useState(false);

  useEffect(() => {
    if (readyForSubmission) {
      fetch("https://aah-aah-invoices.onrender.com/order/", {
        method: "POST",
        body: JSON.stringify(newOrderDetails),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setNewOrderDetails({});
          setOrders([...orders, res]);
          setLoading(false);
          setReadyForSubmission(false);
          navigation.navigate("Orders");
        });
    }
  }, [readyForSubmission]);

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

      setNewOrderDetails({});
      //   return () => {
      //     alert("Screen was unfocused");
      //     // Useful for cleanup functions
      //   };
    }, [])
  );

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <ScrollView>
      <TextInput
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
        value={newOrderDetails.name}
        onChangeText={(text) =>
          setNewOrderDetails({ ...newOrderDetails, name: text })
        }
        placeholder="name"
      />
      <TextInput
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
        value={newOrderDetails.phone}
        onChangeText={(text) =>
          setNewOrderDetails({ ...newOrderDetails, phone: text })
        }
        placeholder="phone"
        keyboardType="numeric"
      />
      <TextInput
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
        value={newOrderDetails.email}
        onChangeText={(text) =>
          setNewOrderDetails({ ...newOrderDetails, email: text })
        }
        placeholder="email"
        keyboardType="email-address"
      />
      <TextInput
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
        value={newOrderDetails.address}
        onChangeText={(text) =>
          setNewOrderDetails({ ...newOrderDetails, address: text })
        }
        placeholder="address"
      />
      <TextInput
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
        value={newOrderDetails.notes}
        onChangeText={(text) =>
          setNewOrderDetails({ ...newOrderDetails, notes: text })
        }
        placeholder="notes"
        multiline={true}
      />
      <Picker
        selectedValue={newOrderDetails.payment}
        onValueChange={(value, idx) =>
          setNewOrderDetails({ ...newOrderDetails, payment: value })
        }
      >
        <Picker.Item label="Select payment type" />
        <Picker.Item label="Zelle" value="Zelle" />
        <Picker.Item label="Venmo" value="Venmo" />
        <Picker.Item label="Square" value="Square" />
        <Picker.Item label="Cash" value="Cash" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={{ marginLeft: 7, fontSize: 16, marginTop: 7 }}>
        Add Item(s):
      </Text>
      <AutocompleteDropdown
        dataSet={items.map((item) => ({ ...item, title: item.name }))}
        closeOnBlur={true}
        closeOnSubmit={true}
        onSelectItem={(item) => {
          if (item) {
            setNewOrderDetails({
              ...newOrderDetails,
              items: newOrderDetails.items
                ? [...newOrderDetails.items, item]
                : [item],
            });
          }
        }}
      />

      <Text style={{ marginLeft: 7, fontSize: 16, marginTop: 7 }}>
        Item(s):
      </Text>
      {newOrderDetails.items && newOrderDetails.items.length
        ? newOrderDetails.items.map((item, idx) => (
            <View
              key={idx}
              style={{
                margin: 7,
                padding: 7,
                backgroundColor: "lightgray",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.name}</Text>
              <Text style={{ fontSize: 16 }}>${item.price}</Text>
              <TextInput
                style={{
                  marginVertical: 7,
                  padding: 7,
                  backgroundColor: "white",
                  marginHorizontal: 7,
                  borderRadius: 5,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  fontSize: 16,
                  width: 100,
                }}
                placeholder="quantity"
                keyboardType="numeric"
                value={newOrderDetails.items[idx].quantity}
                onChangeText={(text) => {
                  const newItems = newOrderDetails.items.filter(
                    (it) => it._id !== item._id
                  );
                  newItems.push({ ...item, quantity: text });
                  setNewOrderDetails({ ...newOrderDetails, items: newItems });
                }}
              />
              <TouchableOpacity
                style={{ position: "absolute", bottom: 14, right: 14 }}
                onPress={() => {
                  setNewOrderDetails({
                    ...newOrderDetails,
                    items: newOrderDetails.items.filter(
                      (it) => it._id !== item._id
                    ),
                  });
                }}
              >
                <Icon name="trash-o" size={30} color={"black"} />
              </TouchableOpacity>
            </View>
          ))
        : null}

      <TouchableOpacity
        disabled={
          !newOrderDetails.name ||
          !newOrderDetails.items?.length ||
          !newOrderDetails.payment
        }
        onPress={() => {
          setLoading(true);
          fetch("https://aah-aah-invoices.onrender.com/order/")
            .then((res) => {
              if (res.status == 200) {
                return res.json();
              }
            })
            .then((res) => {
              const today = new Date().toLocaleDateString();
              const ordersFromToday = res.filter(
                (order) => order.date == today
              );
              const orderSequenceNumber = ordersFromToday.length
                .toString()
                .padStart(2, "0");

              setNewOrderDetails({
                ...newOrderDetails,
                date: today,
                orderNumber: today + orderSequenceNumber,
                status: "pending",
              });
              setReadyForSubmission(true);
            });
        }}
        style={{
          marginHorizontal: 7,
          marginTop: 15,
          padding: 10,
          backgroundColor: "gray",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Submit order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewOrder;
