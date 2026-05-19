import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import {
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

export function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const palette = isDarkMode ? darkPalette : lightPalette;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: palette.background,
        },
      ]}
      testID="home-screen"
    >
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: palette.accent }]}>
          Portfolio project
        </Text>
        <Text style={[styles.title, { color: palette.text }]}>{APP_NAME}</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>
          {APP_TAGLINE}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.cardTitle, { color: palette.text }]}>
          Bootstrap complete
        </Text>
        <Text style={[styles.cardBody, { color: palette.muted }]}>
          The repository is ready for feature development and automation suites.
          Upcoming work covers navigation, state management, forms, and CI
          pipelines.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: palette.text }]}>
        Planned capabilities
      </Text>
      {FEATURES.map(feature => (
        <View
          key={feature}
          style={[styles.featureRow, { borderColor: palette.border }]}
        >
          <View style={[styles.bullet, { backgroundColor: palette.accent }]} />
          <Text style={[styles.featureText, { color: palette.muted }]}>
            {feature}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const lightPalette = {
  background: '#F4F6FB',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#475569',
  accent: '#2563EB',
  border: '#E2E8F0',
} as const;

const darkPalette = {
  background: '#0B1220',
  card: '#111827',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#60A5FA',
  border: '#1E293B',
} as const;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
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
