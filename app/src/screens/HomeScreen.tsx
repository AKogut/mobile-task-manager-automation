import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants/app';
import { TestIds, testIdForTask } from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import { selectHasTasks, useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';
import { getPalette } from '@/theme/palette';

type HomeNavigation = NativeStackNavigationProp<
  AuthenticatedStackParamList,
  'Main'
>;

type TaskStats = {
  total: number;
  open: number;
  completed: number;
};

function formatPriority(priority: Task['priority']): string {
  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
}

function formatTaskMetadata(task: Task): string {
  const status = task.completed ? 'Completed' : 'Open';

  return `${status} - ${formatPriority(task.priority)} priority - Due ${
    task.dueDate
  }`;
}

function startOfToday(): Date {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function parseDueDate(dueDate: string): Date | null {
  const date = new Date(`${dueDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function formatDueLabel(dueDate: string): string {
  const date = parseDueDate(dueDate);

  if (!date) {
    return 'No due date';
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (date.getTime() - startOfToday().getTime()) / millisecondsPerDay,
  );

  if (days === 0) {
    return 'Due today';
  }

  if (days === 1) {
    return 'Due tomorrow';
  }

  if (days > 1) {
    return `Due in ${days} days`;
  }

  return 'Overdue';
}

function countOpenTasksDueToday(tasks: Task[]): number {
  const today = startOfToday().getTime();

  return tasks.filter(task => {
    if (task.completed) {
      return false;
    }

    const dueDate = parseDueDate(task.dueDate);

    return dueDate !== null && dueDate.getTime() === today;
  }).length;
}

function getTodayTasksMessage(
  openCount: number,
  dueTodayCount: number,
): string {
  if (openCount === 0) {
    return "You're all caught up for now.";
  }

  if (dueTodayCount === 1) {
    return 'You have 1 task to finish today.';
  }

  if (dueTodayCount > 1) {
    return `You have ${dueTodayCount} tasks to finish today.`;
  }

  return `You have ${openCount} open task${openCount === 1 ? '' : 's'} waiting.`;
}

function formatDaysRemaining(dueDate: string): string {
  const date = parseDueDate(dueDate);

  if (!date) {
    return 'No deadline';
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (date.getTime() - startOfToday().getTime()) / millisecondsPerDay,
  );

  if (days === 0) {
    return 'Due today';
  }

  if (days === 1) {
    return '1 day left';
  }

  if (days > 1) {
    return `${days} days left`;
  }

  return `Overdue by ${Math.abs(days)} day${days === -1 ? '' : 's'}`;
}

function getTaskStats(tasks: Task[]): TaskStats {
  const completed = tasks.filter(task => task.completed).length;

  return {
    total: tasks.length,
    open: tasks.length - completed,
    completed,
  };
}

function getNextTask(tasks: Task[]): Task | null {
  const openTasks = tasks.filter(task => !task.completed);

  if (openTasks.length === 0) {
    return null;
  }

  return (
    [...openTasks].sort((first, second) =>
      first.dueDate.localeCompare(second.dueDate),
    )[0] ?? null
  );
}

export function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const palette = getPalette(isDarkMode);
  const navigation = useNavigation<HomeNavigation>();
  const user = useAuthStore(state => state.user);
  const tasks = useTaskStore(state => state.tasks);
  const hasTasks = useTaskStore(selectHasTasks);
  const toggleTaskCompleted = useTaskStore(state => state.toggleTaskCompleted);
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 340,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const animatedStyle = useMemo(
    () => ({
      opacity: entrance,
      transform: [
        {
          translateY: entrance.interpolate({
            inputRange: [0, 1],
            outputRange: [18, 0],
          }),
        },
      ],
    }),
    [entrance],
  );

  const stats = getTaskStats(tasks);
  const nextTask = getNextTask(tasks);
  const userName = user?.name ?? 'User';
  const dueTodayCount = countOpenTasksDueToday(tasks);
  const todayTasksMessage = getTodayTasksMessage(stats.open, dueTodayCount);

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
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
        <View style={styles.topActionsRow} testID={TestIds.mainHeaderRow}>
          <View style={styles.header} testID={TestIds.mainHeader}>
            <Text
              style={[styles.appLabel, { color: palette.muted }]}
              testID={TestIds.mainEyebrow}
            >
              {APP_NAME}
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
            styles.heroCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
          testID={TestIds.mainSessionCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroCopy}>
              <Text
                style={[styles.heroGreeting, { color: palette.text }]}
                testID={TestIds.mainTitle}
              >
                {getTimeGreeting()}, {userName}
              </Text>
              <Text
                style={[styles.heroSummary, { color: palette.text }]}
                testID={TestIds.mainSessionTitle}
              >
                {todayTasksMessage}
              </Text>
              <Text
                style={[styles.heroHint, { color: palette.muted }]}
                testID={TestIds.mainSubtitle}
              >
                Stay focused and clear one thing at a time.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Add task"
              accessibilityRole="button"
              onPress={() => {
                navigation.navigate('AddTask');
              }}
              style={({ pressed }) => [
                styles.heroAddButton,
                {
                  backgroundColor: palette.accent,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              testID={TestIds.taskAddButton}
            >
              <Text
                style={styles.heroAddButtonText}
                testID={TestIds.taskAddButtonText}
              >
                Add
              </Text>
            </Pressable>
          </View>

          {nextTask ? (
            <Pressable
              accessibilityLabel={`Open ${nextTask.title} details`}
              accessibilityRole="button"
              onPress={() => {
                navigation.navigate('TaskDetails', { taskId: nextTask.id });
              }}
              style={({ pressed }) => [
                styles.upNextCard,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              testID={TestIds.mainHeroUpNextCard}
            >
              <Text style={[styles.upNextKicker, { color: palette.accent }]}>
                Up next
              </Text>
              <Text
                style={[styles.upNextTitle, { color: palette.text }]}
                testID={TestIds.mainHeroUpNextTitle}
              >
                {nextTask.title}
              </Text>
              <Text
                style={[styles.upNextMeta, { color: palette.muted }]}
                testID={TestIds.mainHeroUpNextMeta}
              >
                {formatDueLabel(nextTask.dueDate)} ·{' '}
                {formatPriority(nextTask.priority)} priority
              </Text>
            </Pressable>
          ) : (
            <View
              style={[
                styles.upNextCard,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.upNextKicker, { color: palette.accent }]}>
                Up next
              </Text>
              <Text style={[styles.upNextTitle, { color: palette.text }]}>
                Nothing scheduled yet
              </Text>
              <Text style={[styles.upNextMeta, { color: palette.muted }]}>
                Add a task with a due date to see it here.
              </Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: palette.text }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: palette.muted }]}>
                Total
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: palette.text }]}>
                {stats.open}
              </Text>
              <Text style={[styles.statLabel, { color: palette.muted }]}>
                Open
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.statValue, { color: palette.text }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: palette.muted }]}>
                Done
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[styles.sectionTitle, { color: palette.text }]}
              testID={TestIds.mainSectionTitle}
            >
              Your tasks
            </Text>
            <Text
              style={[styles.taskListTitle, { color: palette.muted }]}
              testID={TestIds.taskListTitle}
            >
              {hasTasks ? `${tasks.length} saved tasks` : 'No saved tasks'}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Add task"
            accessibilityRole="button"
            onPress={() => {
              navigation.navigate('AddTask');
            }}
            style={({ pressed }) => [
              styles.addButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.addButtonText, { color: palette.text }]}>
              New task
            </Text>
          </Pressable>
        </View>

        <View style={styles.taskListSection} testID={TestIds.taskListSection}>
          {hasTasks ? (
            tasks.map((task, index) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                  },
                ]}
                testID={testIdForTask(index)}
              >
                <View
                  style={[
                    styles.taskAccent,
                    {
                      backgroundColor: task.completed
                        ? palette.disabled
                        : palette.accent,
                    },
                  ]}
                />
                <View style={styles.taskContent}>
                  <View style={styles.taskTopRow}>
                    <View style={styles.taskTitleGroup}>
                      <Text
                        style={[
                          styles.taskTitle,
                          {
                            color: task.completed
                              ? palette.muted
                              : palette.text,
                          },
                          task.completed ? styles.completedTaskTitle : null,
                        ]}
                        testID={`${TestIds.taskItemTitle}-${index}`}
                      >
                        {task.title}
                      </Text>
                      <Text
                        style={[
                          styles.taskDescription,
                          { color: palette.muted },
                        ]}
                        testID={`${TestIds.taskItemDescription}-${index}`}
                      >
                        {task.description || 'No description provided.'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: task.completed
                            ? palette.inputBackground
                            : palette.accent,
                          borderColor: task.completed
                            ? palette.border
                            : palette.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          task.completed
                            ? { color: palette.muted }
                            : styles.statusPillTextOpen,
                        ]}
                      >
                        {task.completed ? 'Done' : 'Open'}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[styles.taskMetadata, { color: palette.accent }]}
                    testID={`${TestIds.taskItemMetadata}-${index}`}
                  >
                    {formatTaskMetadata(task)}
                  </Text>

                  <View
                    style={[
                      styles.daysRemainingPill,
                      {
                        backgroundColor: task.completed
                          ? palette.inputBackground
                          : palette.errorBackground,
                        borderColor: task.completed
                          ? palette.border
                          : palette.errorBorder,
                      },
                    ]}
                    testID={`${TestIds.taskItemDaysRemaining}-${index}`}
                  >
                    <Text
                      style={[
                        styles.daysRemainingText,
                        {
                          color: task.completed ? palette.muted : palette.error,
                        },
                      ]}
                    >
                      {task.completed
                        ? 'Finished'
                        : formatDaysRemaining(task.dueDate)}
                    </Text>
                  </View>

                  <View style={styles.taskActionRow}>
                    <Pressable
                      accessibilityLabel={`Open ${task.title} details`}
                      accessibilityRole="button"
                      onPress={() => {
                        navigation.navigate('TaskDetails', { taskId: task.id });
                      }}
                      style={({ pressed }) => [
                        styles.detailsButton,
                        {
                          backgroundColor: palette.inputBackground,
                          borderColor: palette.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailsButtonText,
                          { color: palette.text },
                        ]}
                      >
                        View details
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel={
                        task.completed
                          ? `Mark ${task.title} incomplete`
                          : `Mark ${task.title} completed`
                      }
                      accessibilityRole="button"
                      onPress={() => {
                        toggleTaskCompleted(task.id);
                      }}
                      style={({ pressed }) => [
                        styles.completeButton,
                        {
                          borderColor: palette.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                      testID={`${TestIds.taskToggleButton}-${index}`}
                    >
                      <Text
                        style={[
                          styles.completeButtonText,
                          { color: palette.text },
                        ]}
                        testID={`${TestIds.taskToggleButtonText}-${index}`}
                      >
                        {task.completed ? 'Reopen' : 'Complete'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={[
                styles.emptyStateCard,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}
              testID={TestIds.taskEmptyStateCard}
            >
              <View
                style={[
                  styles.emptyBadge,
                  {
                    backgroundColor: palette.inputBackground,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text
                  style={[styles.emptyBadgeText, { color: palette.accent }]}
                >
                  0
                </Text>
              </View>
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
                Start with one focused task, choose a priority, and set a due
                date.
              </Text>
              <Pressable
                accessibilityLabel="Add first task"
                accessibilityRole="button"
                onPress={() => {
                  navigation.navigate('AddTask');
                }}
                style={({ pressed }) => [
                  styles.emptyCta,
                  {
                    backgroundColor: palette.accent,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text style={styles.emptyCtaText}>Create first task</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  animatedContent: {
    gap: 18,
  },
  topActionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
  },
  appLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  settingsButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
    gap: 6,
  },
  heroGreeting: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  heroSummary: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  heroHint: {
    fontSize: 14,
    lineHeight: 20,
  },
  upNextCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  upNextKicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  upNextTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  upNextMeta: {
    fontSize: 14,
    lineHeight: 20,
  },
  heroAddButton: {
    alignItems: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 56,
    minWidth: 70,
    paddingHorizontal: 16,
  },
  heroAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  taskListTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  addButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  taskListSection: {
    gap: 14,
  },
  taskCard: {
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  taskAccent: {
    width: 5,
  },
  taskContent: {
    flex: 1,
    gap: 12,
    padding: 18,
  },
  taskTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  taskTitleGroup: {
    flex: 1,
    gap: 6,
  },
  taskTitle: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusPillTextOpen: {
    color: '#FFFFFF',
  },
  taskMetadata: {
    fontSize: 13,
    fontWeight: '700',
  },
  daysRemainingPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  daysRemainingText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  taskActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  completeButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyStateCard: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    gap: 12,
    padding: 28,
  },
  emptyBadge: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  emptyBadgeText: {
    fontSize: 32,
    fontWeight: '800',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  emptyStateDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  emptyCta: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 52,
    paddingHorizontal: 18,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
