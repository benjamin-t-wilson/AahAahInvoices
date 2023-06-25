import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

const OrderCard = ({ order, orders, setOrders, navigation }) => {
  const [expanded, setExpanded] = useState(false);
  const [deletion, setDeletion] = useState(false);

  const handleDelete = () => {
    if (!deletion) {
      setDeletion(true);
    } else {
      setDeletion(false);
      setOrders(orders.filter((ord) => ord._id !== order._id));
      fetch("https://aah-aah-invoices.onrender.com/order/" + order._id, {
        method: "DELETE",
      });
    }
  };

  const handleEditing = () => {
    navigation.navigate("Edit Order", { order });
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "lightgray",
        margin: 5,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text>{order.name}</Text>
        <Text>{order.date}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text>#{order.orderNumber}</Text>
        <Text>
          $
          {parseFloat(
            order.items.reduce((a, b) => (a += b.price * b.quantity), 0)
          ).toFixed(2)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text>Status: {order.status}</Text>
        <Text>Paid by: {order.payment}</Text>
      </View>

      {expanded ? (
        <View
          style={{
            width: "100%",
            borderTopWidth: 1,
            borderTopColor: "lightgray",
            marginTop: 5,
            paddingTop: 5,
          }}
        >
          {order.address ? (
            <>
              <Text>Address:</Text>
              <Text>{order.address}</Text>
            </>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 5,
            }}
          >
            {order.email ? (
              <View>
                <Text>Email:</Text>
                <Text>{order.email}</Text>
              </View>
            ) : null}
            {order.phone ? (
              <View>
                <Text>Phone:</Text>
                <Text>{order.phone}</Text>
              </View>
            ) : null}
          </View>

          {order.notes ? (
            <>
              <Text>Notes:</Text>
              <Text>{order.notes}</Text>
            </>
          ) : null}

          {order.items.map((item, idx) => (
            <View
              key={idx}
              style={{
                marginVertical: 7,
                padding: 7,
                backgroundColor: "lightgray",
                borderRadius: 10,
              }}
            >
              <Text>{item.name}</Text>
              <Text>
                ${item.price} x {item.quantity}
              </Text>
            </View>
          ))}

          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <TouchableOpacity onPress={handleEditing}>
              <Icon name="edit" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Icon
                name="trash-o"
                size={30}
                color={deletion ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Icon
          name={expanded ? "chevron-up" : "chevron-down"}
          size={30}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;
