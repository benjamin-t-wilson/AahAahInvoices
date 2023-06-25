import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import OrderCard from "../components/orderCard";
import { Picker } from "@react-native-picker/picker";

const Orders = ({ orders, setOrders, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("None");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (orders.length) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  useFocusEffect(
    useCallback(() => {
      if (!orders.length) {
        setLoading(true);
        fetch("https://aah-aah-invoices.onrender.com/order/")
          .then((res) => {
            if (res.status == 200) {
              return res.json();
            }
          })
          .then((res) => {
            setLoading(false);
            setOrders(res);
          });
      }

      //   return () => {
      //     alert("Screen was unfocused");
      //     // Useful for cleanup functions
      //   };
    }, [])
  );

  useEffect(() => {
    if (searchValue) {
      setFilter("None");
      setFilteredOrders(
        orders.filter(
          (ord) =>
            ord.name.includes(searchValue) ||
            ord.address.includes(searchValue) ||
            ord.email.includes(searchValue)
        )
      );
    }
  }, [searchValue]);

  const handleFilterChange = (value, idx) => {
    setFilter(value);
    setSearchValue("");

    switch (idx) {
      case 0:
        setFilteredOrders([...orders]);
        break;
      case 1:
        setFilteredOrders(orders.filter((ord) => ord.status == "Pending"));
        break;
      case 2:
        setFilteredOrders(orders.filter((ord) => ord.status == "Paid"));
        break;
      case 3:
        setFilteredOrders(orders.filter((ord) => ord.status == "Made"));
        break;
      case 4:
        setFilteredOrders(orders.filter((ord) => ord.status == "Completed"));
        break;
    }
  };

  return loading ? (
    <Text>Loading...</Text>
  ) : (
    <ScrollView>
      <View
        style={{
          margin: 5,
          padding: 7,
          borderRadius: 10,
          backgroundColor: "lightgray",
        }}
      >
        <Text style={{ fontSize: 16, marginLeft: 5, marginTop: 5 }}>
          Filter by:
        </Text>
        <Picker
          selectedValue={filter}
          onValueChange={(value, idx) => handleFilterChange(value, idx)}
        >
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Paid" value="Paid" />
          <Picker.Item label="Made" value="Made" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View>

      <View
        style={{
          margin: 5,
          padding: 7,
          borderRadius: 10,
          backgroundColor: "lightgray",
          alignItems: "center",
        }}
      >
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search..."
          style={{
            backgroundColor: "white",
            color: "black",
            borderRadius: 5,
            fontSize: 16,
            padding: 7,
            width: "90%",
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setSearchValue("");
            setFilteredOrders([...orders]);
          }}
          style={{
            backgroundColor: "gray",
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Clear search</Text>
        </TouchableOpacity>
      </View>

      {filteredOrders.map((order, idx) => (
        <OrderCard
          key={idx}
          order={order}
          orders={orders}
          setOrders={setOrders}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  );
};

export default Orders;
