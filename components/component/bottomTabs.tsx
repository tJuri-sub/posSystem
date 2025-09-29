import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  HomeOutline,
  HomeRounded,
  InventoryOutline,
  InventoryRounded,
  SalesOutline,
  SalesRounded,
} from '../assets/svg/TabIcons';

import { Homescreen } from '../screens/homescreen';
import { Sales } from '../screens/sales';
import { Inventory } from '../screens/inventory';

const Tabs = createBottomTabNavigator();

const getTabIcon = (routeName: string, focused: boolean, size: number) => {
  const fixedColor = '#00487C';

  switch (routeName) {
    case 'Home':
      return focused ? (
        <HomeRounded width={size} height={size} fill={fixedColor} />
      ) : (
        <HomeOutline width={size} height={size} fill={fixedColor} />
      );

    case 'Sales':
      return focused ? (
        <SalesRounded width={size} height={size} fill={fixedColor} />
      ) : (
        <SalesOutline width={size} height={size} fill={fixedColor} />
      );

    case 'Inventory':
      return focused ? (
        <InventoryRounded width={size} height={size} fill={fixedColor} />
      ) : (
        <InventoryOutline width={size} height={size} fill={fixedColor} />
      );

    default:
      return null;
  }
};

export const CustomTabs = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => getTabIcon(route.name, focused, size),
      headerStyle: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTintColor: '#00487C',
      headerTitleStyle: { fontWeight: 'bold' },
      tabBarActiveTintColor: '#00487C',
      tabBarInactiveTintColor: '#00487C',
    })}
  >
    <Tabs.Screen name="Sales" component={Sales} />
    <Tabs.Screen name="Home" component={Homescreen} />
    <Tabs.Screen name="Inventory" component={Inventory} />
  </Tabs.Navigator>
);
