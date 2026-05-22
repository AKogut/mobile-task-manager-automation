import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { TestIds } from '@/constants/testIds';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/authStore';
import { AddTaskScreen } from '@/screens/AddTaskScreen';
import { EditTaskScreen } from '@/screens/EditTaskScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { TaskDetailsScreen } from '@/screens/TaskDetailsScreen';
import { getPalette } from '@/theme/palette';

export type RootStackParamList = {
  Login: undefined;
  Authenticated: undefined;
};

export type AuthenticatedStackParamList = {
  Main: undefined;
  AddTask: undefined;
  TaskDetails: { taskId: string };
  EditTask: { taskId: string };
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthenticatedStack =
  createNativeStackNavigator<AuthenticatedStackParamList>();

function AuthenticatedNavigator() {
  return (
    <AuthenticatedStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthenticatedStack.Screen name="Main" component={HomeScreen} />
      <AuthenticatedStack.Screen name="AddTask" component={AddTaskScreen} />
      <AuthenticatedStack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
      />
      <AuthenticatedStack.Screen name="EditTask" component={EditTaskScreen} />
      <AuthenticatedStack.Screen name="Settings" component={SettingsScreen} />
    </AuthenticatedStack.Navigator>
  );
}

export function RootNavigator() {
  const isDarkMode = useColorScheme() === 'dark';
  const palette = getPalette(isDarkMode);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (hasHydrated) {
      return undefined;
    }

    let isActive = true;
    const finishHydration = () => {
      if (isActive) {
        useAuthStore.getState().setHasHydrated(true);
      }
    };

    const unsubscribe = useAuthStore.persist.onFinishHydration(finishHydration);

    if (useAuthStore.persist.hasHydrated()) {
      finishHydration();
    }

    const timeout = setTimeout(finishHydration, 1500);

    return () => {
      isActive = false;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [hasHydrated]);

  if (!hasHydrated) {
    return (
      <View
        accessibilityLabel="Restoring authentication session"
        style={[styles.loading, { backgroundColor: palette.background }]}
        testID={TestIds.authLoading}
      >
        <ActivityIndicator
          accessibilityLabel="Authentication loading indicator"
          color={palette.accent}
          size="large"
          testID={TestIds.authLoadingIndicator}
        />
      </View>
    );
  }

  return (
    <View style={styles.root} testID={TestIds.navigationRoot}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <RootStack.Screen
              name="Authenticated"
              component={AuthenticatedNavigator}
            />
          ) : (
            <RootStack.Screen name="Login" component={LoginScreen} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
