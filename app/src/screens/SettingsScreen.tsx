import { TestIds } from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import { getPalette } from '@/theme/palette';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SettingsScreenProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'Settings'
>;

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const palette = getPalette(isDarkMode);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <ScrollView
      accessibilityLabel="Settings screen"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: palette.background,
        },
      ]}
      testID={TestIds.settingsScreen}
    >
      <View style={styles.header} testID={TestIds.settingsHeader}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => {
            navigation.goBack();
          }}
          style={({ pressed }) => [
            styles.backButton,
            {
              borderColor: palette.border,
              backgroundColor: palette.card,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          testID={TestIds.settingsBackButton}
        >
          <Text
            style={[styles.backButtonText, { color: palette.text }]}
            testID={TestIds.settingsBackButtonText}
          >
            Back
          </Text>
        </Pressable>
        <Text
          style={[styles.title, { color: palette.text }]}
          testID={TestIds.settingsTitle}
        >
          Settings
        </Text>
        <Text
          style={[styles.subtitle, { color: palette.muted }]}
          testID={TestIds.settingsSubtitle}
        >
          Manage your account and session.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
        testID={TestIds.settingsAccountCard}
      >
        <Text
          style={[styles.cardTitle, { color: palette.text }]}
          testID={TestIds.settingsAccountTitle}
        >
          Account
        </Text>
        <Text
          style={[styles.cardBody, { color: palette.muted }]}
          testID={TestIds.settingsAccountName}
        >
          {user?.name ?? 'User'}
        </Text>
        <Text
          style={[styles.cardBody, { color: palette.muted }]}
          testID={TestIds.settingsAccountEmail}
        >
          {user?.email ?? ''}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
        testID={TestIds.settingsSessionCard}
      >
        <Text
          style={[styles.cardTitle, { color: palette.text }]}
          testID={TestIds.settingsSessionTitle}
        >
          Session
        </Text>
        <Text
          style={[styles.cardBody, { color: palette.muted }]}
          testID={TestIds.settingsSessionDescription}
        >
          Logging out clears your saved session on this device.
        </Text>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: palette.error,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          testID={TestIds.logoutButton}
        >
          <Text
            style={styles.logoutButtonText}
            testID={TestIds.logoutButtonText}
          >
            Log out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  logoutButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
    paddingVertical: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
