import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { useAuthStore } from '../store/useAuthStore';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

// Mock Dashboard Component for Demo
const DashboardScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Welcome to Farm Seeva Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fdf8' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' }
});

export const AppNavigator = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
