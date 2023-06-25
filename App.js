import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

import NewOrder from "./pages/NewOrder";
import Items from "./pages/Items";
import Orders from "./pages/Orders";
import EditOrder from "./pages/EditOrder";

const Tab = createBottomTabNavigator();

export default function App() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  return (
    <AutocompleteDropdownContextProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Orders">
          <Tab.Screen
            name="New Order"
            options={{
              tabBarIcon: () => null,
              tabBarLabelStyle: { fontSize: 18, marginBottom: 10 },
            }}
          >
            {(props) => (
              <NewOrder
                {...props}
                items={items}
                setItems={setItems}
                orders={orders}
                setOrders={setOrders}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Orders"
            options={{
              tabBarIcon: () => null,
              tabBarLabelStyle: { fontSize: 18, marginBottom: 10 },
            }}
          >
            {(props) => (
              <Orders {...props} orders={orders} setOrders={setOrders} />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Items"
            options={{
              tabBarIcon: () => null,
              tabBarLabelStyle: { fontSize: 18, marginBottom: 10 },
            }}
          >
            {(props) => <Items {...props} items={items} setItems={setItems} />}
          </Tab.Screen>

          <Tab.Screen name="Edit Order" options={{ tabBarButton: () => null }}>
            {(props) => (
              <EditOrder
                {...props}
                items={items}
                setItems={setItems}
                orders={orders}
                setOrders={setOrders}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </AutocompleteDropdownContextProvider>
  );
}
