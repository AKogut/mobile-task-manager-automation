import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { TestIds, testIdForFeature } from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';
import { getPalette } from '@/theme/palette';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FEATURES = [
  'Authentication with session persistence',
  'Task CRUD, search, filters, and sorting',
  'Local storage with AsyncStorage',
  'Appium + WebdriverIO cross-platform E2E',
  'Native iOS tests with Swift + XCUITest',
  'Native Android tests with Kotlin + Espresso',
] as const;

type HomeNavigation = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'Main'
>;

export function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const palette = getPalette(isDarkMode);
  const navigation = useNavigation<HomeNavigation>();
  const user = useAuthStore(state => state.user);

  return (
    <ScrollView
      accessibilityLabel="Authenticated main screen"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: palette.background,
        },
      ]}
      testID={TestIds.mainScreen}
    >
      <View style={styles.headerRow} testID={TestIds.mainHeaderRow}>
        <View style={styles.header} testID={TestIds.mainHeader}>
          <Text
            style={[styles.eyebrow, { color: palette.accent }]}
            testID={TestIds.mainEyebrow}
          >
            Signed in
          </Text>
          <Text
            style={[styles.title, { color: palette.text }]}
            testID={TestIds.mainTitle}
          >
            {APP_NAME}
          </Text>
          <Text
            style={[styles.subtitle, { color: palette.muted }]}
            testID={TestIds.mainSubtitle}
          >
            {APP_TAGLINE}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          onPress={() => {
            navigation.navigate('Settings');
          }}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              borderColor: palette.border,
              backgroundColor: palette.card,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          testID={TestIds.settingsOpenButton}
        >
          <Text
            style={[styles.settingsButtonText, { color: palette.text }]}
            testID={TestIds.settingsOpenButtonText}
          >
            Settings
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
        testID={TestIds.mainSessionCard}
      >
        <Text
          style={[styles.cardTitle, { color: palette.text }]}
          testID={TestIds.mainSessionTitle}
        >
          Welcome, {user?.name ?? 'User'}
        </Text>
        <Text
          style={[styles.cardBody, { color: palette.muted }]}
          testID={TestIds.mainSessionDescription}
        >
          You are authenticated as {user?.email}. Your session is stored locally
          and will be restored on the next app launch.
        </Text>
      </View>

      <Text
        style={[styles.sectionTitle, { color: palette.text }]}
        testID={TestIds.mainSectionTitle}
      >
        Planned capabilities
      </Text>
      {FEATURES.map((feature, index) => (
        <View
          key={feature}
          style={[styles.featureRow, { borderColor: palette.border }]}
          testID={testIdForFeature(index)}
        >
          <View
            accessibilityLabel={`${feature} indicator`}
            style={[styles.bullet, { backgroundColor: palette.accent }]}
            testID={`${TestIds.mainFeatureBullet}-${index}`}
          />
          <Text
            style={[styles.featureText, { color: palette.muted }]}
            testID={`${TestIds.mainFeatureText}-${index}`}
          >
            {feature}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  settingsButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
