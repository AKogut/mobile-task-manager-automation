import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants/app';
import { SegmentedControl } from '@/components/SegmentedControl';
import {
  TestIds,
  testIdForPriorityFilter,
  testIdForStatusFilter,
  testIdForTask,
  testIdForTaskSort,
} from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import {
  formatDaysRemaining,
  formatDueLabel,
  parseUtcDueDate,
  startOfToday,
} from '@/features/tasks/taskDates';
import {
  formatPriorityLabel,
  getPriorityColors,
  priorityRank,
} from '@/features/tasks/taskPriority';
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

type TaskStatusFilter = 'all' | 'open' | 'completed';
type TaskPriorityFilter = 'all' | Task['priority'];
type TaskSortOption = 'dueDate' | 'priority' | 'status';

const statusFilters: Array<{ label: string; value: TaskStatusFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Done', value: 'completed' },
];

const priorityFilters: Array<{ label: string; value: TaskPriorityFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const sortOptions: Array<{ label: string; value: TaskSortOption }> = [
  { label: 'Due date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Status', value: 'status' },
];

function formatTaskMetadata(task: Task): string {
  const status = task.completed ? 'Completed' : 'Open';

  return `${status} - ${formatPriorityLabel(task.priority)} priority - Due ${
    task.dueDate
  }`;
}

function countOpenTasksDueToday(tasks: Task[]): number {
  const today = startOfToday().getTime();

  return tasks.filter(task => {
    if (task.completed) {
      return false;
    }

    const dueDate = parseUtcDueDate(task.dueDate);

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

function getVisibleTasks(
  tasks: Task[],
  searchQuery: string,
  statusFilter: TaskStatusFilter,
  priorityFilter: TaskPriorityFilter,
  sortOption: TaskSortOption,
): Task[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks
    .filter(task => {
      if (statusFilter === 'open' && task.completed) {
        return false;
      }

      if (statusFilter === 'completed' && !task.completed) {
        return false;
      }

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      if (normalizedQuery.length === 0) {
        return true;
      }

      return task.title.toLowerCase().includes(normalizedQuery);
    })
    .sort((first, second) => {
      if (sortOption === 'priority') {
        return (
          priorityRank[second.priority] - priorityRank[first.priority] ||
          first.dueDate.localeCompare(second.dueDate)
        );
      }

      if (sortOption === 'status') {
        return (
          Number(first.completed) - Number(second.completed) ||
          first.dueDate.localeCompare(second.dueDate)
        );
      }

      return first.dueDate.localeCompare(second.dueDate);
    });
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriorityFilter>('all');
  const [sortOption, setSortOption] = useState<TaskSortOption>('dueDate');
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
  const visibleTasks = useMemo(
    () =>
      getVisibleTasks(
        tasks,
        searchQuery,
        statusFilter,
        priorityFilter,
        sortOption,
      ),
    [priorityFilter, searchQuery, sortOption, statusFilter, tasks],
  );
  const hasActiveTaskFilters =
    searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all';
  const visibleTasksCountLabel = `${visibleTasks.length} task${
    visibleTasks.length === 1 ? '' : 's'
  }`;

  const renderTask = ({ item: task, index }: ListRenderItemInfo<Task>) => {
    const priorityColors = getPriorityColors(task.priority, palette);

    return (
      <View
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
                : priorityColors.accent,
            },
          ]}
        />
        <View style={styles.taskContent}>
          <View style={styles.taskTopRow}>
            <View style={styles.taskTitleGroup}>
              <Text
                style={[
                  styles.taskTitle,
                  { color: task.completed ? palette.muted : palette.text },
                  task.completed ? styles.completedTaskTitle : null,
                ]}
                testID={`${TestIds.taskItemTitle}-${index}`}
              >
                {task.title}
              </Text>
              <Text
                style={[styles.taskDescription, { color: palette.muted }]}
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
                  borderColor: task.completed ? palette.border : palette.accent,
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

          <View style={styles.taskMetaRow}>
            <View
              style={[
                styles.priorityPill,
                {
                  backgroundColor: priorityColors.background,
                  borderColor: priorityColors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityPillText,
                  { color: priorityColors.text },
                ]}
              >
                {formatPriorityLabel(task.priority)} priority
              </Text>
            </View>
            <Text
              style={[styles.taskMetadata, { color: palette.accent }]}
              testID={`${TestIds.taskItemMetadata}-${index}`}
            >
              {formatTaskMetadata(task)}
            </Text>
          </View>

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
                { color: task.completed ? palette.muted : palette.error },
              ]}
            >
              {task.completed ? 'Finished' : formatDaysRemaining(task.dueDate)}
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
              <Text style={[styles.detailsButtonText, { color: palette.text }]}>
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
                style={[styles.completeButtonText, { color: palette.text }]}
                testID={`${TestIds.taskToggleButtonText}-${index}`}
              >
                {task.completed ? 'Reopen' : 'Complete'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const header = (
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
              {formatPriorityLabel(nextTask.priority)} priority
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
            {hasTasks
              ? `${visibleTasks.length} of ${tasks.length} tasks`
              : 'No saved tasks'}
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

      {hasTasks ? (
        <View
          style={[
            styles.controlsCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
              shadowColor: palette.text,
            },
          ]}
        >
          <View style={styles.controlsHeader}>
            <View
              style={[
                styles.controlsCountBadge,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.controlsCountText, { color: palette.text }]}>
                {visibleTasksCountLabel}
              </Text>
            </View>
            {hasActiveTaskFilters ? (
              <Pressable
                accessibilityLabel="Clear filters"
                accessibilityRole="button"
                onPress={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
                style={({ pressed }) => [
                  styles.clearFiltersButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text
                  style={[styles.clearFiltersText, { color: palette.error }]}
                >
                  Clear filters
                </Text>
              </Pressable>
            ) : null}
          </View>

          <TextInput
            accessibilityLabel="Search tasks"
            autoCapitalize="none"
            onChangeText={setSearchQuery}
            placeholder="Search by title"
            placeholderTextColor={palette.muted}
            style={[
              styles.searchInput,
              {
                backgroundColor: palette.inputBackground,
                borderColor: palette.border,
                color: palette.text,
              },
            ]}
            testID={TestIds.taskSearchInput}
            value={searchQuery}
          />

          <SegmentedControl
            accessibilityLabelForOption={filter => `Show ${filter.label} tasks`}
            onChange={setStatusFilter}
            options={statusFilters}
            palette={palette}
            testIdForOption={testIdForStatusFilter}
            value={statusFilter}
          />

          <SegmentedControl
            accessibilityLabelForOption={option =>
              `Sort tasks by ${option.label}`
            }
            onChange={setSortOption}
            options={sortOptions}
            palette={palette}
            testIdForOption={testIdForTaskSort}
            value={sortOption}
          />

          <SegmentedControl
            accessibilityLabelForOption={filter =>
              `Show ${filter.label} priority tasks`
            }
            onChange={setPriorityFilter}
            options={priorityFilters}
            palette={palette}
            renderIcon={(filter, isSelected) => {
              const indicatorColor =
                filter.value === 'all'
                  ? isSelected
                    ? palette.card
                    : palette.accent
                  : getPriorityColors(filter.value, palette).text;

              return (
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: indicatorColor },
                  ]}
                />
              );
            }}
            testIdForOption={testIdForPriorityFilter}
            value={priorityFilter}
          />
        </View>
      ) : null}
    </Animated.View>
  );

  return (
    <FlatList
      accessibilityLabel="Authenticated main screen"
      data={visibleTasks}
      keyExtractor={task => task.id}
      ListEmptyComponent={
        hasTasks ? (
          <View
            style={[
              styles.emptyStateCard,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}
            testID={TestIds.taskNoResultsCard}
          >
            <Text style={[styles.emptyStateTitle, { color: palette.text }]}>
              No matching tasks
            </Text>
            <Text
              style={[styles.emptyStateDescription, { color: palette.muted }]}
            >
              Try a different title search, status filter, or sort option.
            </Text>
          </View>
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
              <Text style={[styles.emptyBadgeText, { color: palette.accent }]}>
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
        )
      }
      ListHeaderComponent={header}
      renderItem={renderTask}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: palette.background,
        },
      ]}
      testID={TestIds.mainScreen}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 14,
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
  controlsCard: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  controlsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlsCountBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  controlsCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  clearFiltersButton: {
    paddingVertical: 2,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '800',
  },
  searchInput: {
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  priorityIndicator: {
    borderRadius: 999,
    height: 8,
    width: 8,
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
  taskMetaRow: {
    alignItems: 'flex-start',
    gap: 8,
  },
  priorityPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
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
