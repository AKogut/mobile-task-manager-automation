import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { TestIds, testIdForTask } from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import { selectHasTasks, useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';
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

type HomeNavigation = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'Main'
>;

function formatTaskMetadata(task: Task): string {
  const status = task.completed ? 'Completed' : 'Open';
  const priority = `${task.priority.charAt(0).toUpperCase()}${task.priority.slice(
    1,
  )} priority`;

  return `${status} - ${priority} - Due ${task.dueDate}`;
}

export function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const palette = getPalette(isDarkMode);
  const navigation = useNavigation<HomeNavigation>();
  const user = useAuthStore(state => state.user);
  const tasks = useTaskStore(state => state.tasks);
  const hasTasks = useTaskStore(selectHasTasks);

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
        Tasks
      </Text>

      <View style={styles.taskListSection} testID={TestIds.taskListSection}>
        <Text
          style={[styles.taskListTitle, { color: palette.muted }]}
          testID={TestIds.taskListTitle}
        >
          {hasTasks ? `${tasks.length} saved tasks` : 'No saved tasks'}
        </Text>

        {hasTasks ? (
          tasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                { backgroundColor: palette.card, borderColor: palette.border },
              ]}
              testID={testIdForTask(index)}
            >
              <Text
                style={[styles.taskTitle, { color: palette.text }]}
                testID={`${TestIds.taskItemTitle}-${index}`}
              >
                {task.title}
              </Text>
              <Text
                style={[styles.taskDescription, { color: palette.muted }]}
                testID={`${TestIds.taskItemDescription}-${index}`}
              >
                {task.description}
              </Text>
              <Text
                style={[styles.taskMetadata, { color: palette.accent }]}
                testID={`${TestIds.taskItemMetadata}-${index}`}
              >
                {formatTaskMetadata(task)}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={[
              styles.emptyStateCard,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
            testID={TestIds.taskEmptyStateCard}
          >
            <Text
              style={[styles.emptyStateTitle, { color: palette.text }]}
              testID={TestIds.taskEmptyStateTitle}
            >
              No tasks yet
            </Text>
            <Text
              style={[styles.emptyStateDescription, { color: palette.muted }]}
              testID={TestIds.taskEmptyStateDescription}
            >
              Created tasks will appear here once task creation is available.
            </Text>
          </View>
        )}
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
  taskListSection: {
    gap: 12,
  },
  taskListTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  taskCard: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  taskMetadata: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyStateCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  emptyStateDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
});
