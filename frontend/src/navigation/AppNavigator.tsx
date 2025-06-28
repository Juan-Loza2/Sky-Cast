
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FiltersScreen from '../screens/FiltersScreen';
import AboutScreen from '../screens/AboutScreen';

import {COLORS, SIZES} from '../constants/theme';

// Tipos de navegación
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: {productId: number};
  Filters: {currentFilters?: any};
};

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configuración de íconos para tabs
const getTabBarIcon = (routeName: string, focused: boolean, size: number) => {
  let iconName: string;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Products':
      iconName = focused ? 'weather-cloudy' : 'weather-cloudy';
      break;
    case 'About':
      iconName = focused ? 'information' : 'information-outline';
      break;
    default:
      iconName = 'help-circle-outline';
  }

  return (
    <Icon
      name={iconName}
      size={size}
      color={focused ? COLORS.primary : COLORS.textMuted}
    />
  );
};

// Navegador de tabs principales
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size}) =>
          getTabBarIcon(route.name, focused, size),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: SIZES.xs,
          paddingBottom: SIZES.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: SIZES.textSm,
          fontWeight: '500',
          marginTop: SIZES.xs,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontSize: SIZES.textXl,
          fontWeight: '600',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerTitle: 'OHMC Weather',
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Productos',
          headerTitle: 'Productos Meteorológicos',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Acerca de',
          headerTitle: 'Información',
        }}
      />
    </Tab.Navigator>
  );
};

// Navegador principal con stack
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontSize: SIZES.textXl,
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Detalle del Producto',
          headerBackTitle: 'Volver',
        }}
      />
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{
          title: 'Filtros',
          headerBackTitle: 'Volver',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
