import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TestIds } from '@/constants/testIds';
import { selectTaskById, useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';
import { getPalette } from '@/theme/palette';

type TaskDetailsScreenProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'TaskDetails'
>;

type DueDateParts = {
  weekday: string;
  month: string;
  day: string;
  year: string;
};

function formatPriority(priority: Task['priority']): string {
  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
}

function parseDueDate(dueDate: string): DueDateParts {
  const date = new Date(`${dueDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return {
      weekday: 'Due',
      month: 'Date',
      day: '--',
      year: dueDate,
    };
  }

  return {
    weekday: date.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    }),
    month: date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    }),
    day: date.toLocaleDateString('en-US', {
      day: '2-digit',
      timeZone: 'UTC',
    }),
    year: date.toLocaleDateString('en-US', {
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };
}

export function TaskDetailsScreen({
  navigation,
  route,
}: TaskDetailsScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const palette = getPalette(isDarkMode);
  const insets = useSafeAreaInsets();
  const task = useTaskStore(selectTaskById(route.params.taskId));
  const deleteTask = useTaskStore(state => state.deleteTask);
  const toggleTaskCompleted = useTaskStore(state => state.toggleTaskCompleted);
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 320,
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

  const confirmDelete = () => {
    Alert.alert('Delete task?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(route.params.taskId);
          navigation.navigate('Main');
        },
      },
    ]);
  };

  if (!task) {
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
        testID={TestIds.taskDetailsScreen}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={({ pressed }) => [
              styles.navButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={TestIds.taskDetailsBackButton}
          >
            <Text style={[styles.navButtonText, { color: palette.text }]}>
              Back
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.title, { color: palette.text }]}>
          Task not found
        </Text>
      </ScrollView>
    );
  }

  const dueDate = parseDueDate(task.dueDate);

  return (
    <ScrollView
      accessibilityLabel="Task details screen"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          backgroundColor: palette.background,
        },
      ]}
      testID={TestIds.taskDetailsScreen}
    >
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={({ pressed }) => [
              styles.navButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={TestIds.taskDetailsBackButton}
          >
            <Text style={[styles.navButtonText, { color: palette.text }]}>
              Back
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Go to home screen"
            accessibilityRole="button"
            onPress={() => {
              navigation.navigate('Main');
            }}
            style={({ pressed }) => [
              styles.navButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={TestIds.taskDetailsHomeButton}
          >
            <Text style={[styles.navButtonText, { color: palette.text }]}>
              Home
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
        >
          <View style={styles.chipRow}>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor: task.completed
                    ? palette.accent
                    : palette.inputBackground,
                  borderColor: task.completed ? palette.accent : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  task.completed
                    ? styles.statusChipTextCompleted
                    : { color: palette.text },
                ]}
              >
                {task.completed ? 'Completed' : 'Open'}
              </Text>
            </View>
            <View
              style={[
                styles.priorityChip,
                {
                  backgroundColor: palette.inputBackground,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text
                style={[styles.priorityChipText, { color: palette.accent }]}
              >
                {formatPriority(task.priority)} priority
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.title,
              { color: task.completed ? palette.muted : palette.text },
              task.completed ? styles.completedTitle : null,
            ]}
            testID={TestIds.taskDetailsTitle}
          >
            {task.title}
          </Text>
          <Text
            style={[styles.description, { color: palette.muted }]}
            testID={TestIds.taskDetailsDescription}
          >
            {task.description || 'No description provided.'}
          </Text>
        </View>

        <View
          style={[
            styles.calendarCard,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
          testID={TestIds.taskDetailsCalendarCard}
        >
          <View
            style={[styles.calendarBadge, { backgroundColor: palette.accent }]}
          >
            <Text style={styles.calendarMonth}>{dueDate.month}</Text>
            <Text style={styles.calendarDay}>{dueDate.day}</Text>
          </View>
          <View style={styles.calendarCopy}>
            <Text style={[styles.kicker, { color: palette.accent }]}>
              Due date
            </Text>
            <Text
              style={[styles.calendarTitle, { color: palette.text }]}
              testID={TestIds.taskDetailsMetadata}
            >
              {dueDate.weekday}, {dueDate.month} {dueDate.day}, {dueDate.year}
            </Text>
            <Text style={[styles.calendarHint, { color: palette.muted }]}>
              Keep this deadline visible while planning your next step.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.actionPanel,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}
        >
          <Pressable
            accessibilityLabel={
              task.completed
                ? 'Mark task as incomplete'
                : 'Mark task as completed'
            }
            accessibilityRole="button"
            onPress={() => {
              toggleTaskCompleted(task.id);
            }}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: palette.accent,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            testID={TestIds.taskDetailsCompleteButton}
          >
            <Text style={styles.primaryButtonText}>
              {task.completed ? 'Reopen task' : 'Complete task'}
            </Text>
          </Pressable>

          <View style={styles.actionRow}>
            <Pressable
              accessibilityLabel="Edit task"
              accessibilityRole="button"
              onPress={() => {
                navigation.navigate('EditTask', { taskId: task.id });
              }}
              style={({ pressed }) => [
                styles.outlineButton,
                {
                  borderColor: palette.border,
                  backgroundColor: palette.inputBackground,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              testID={TestIds.taskDetailsEditButton}
            >
              <Text style={[styles.outlineButtonText, { color: palette.text }]}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Delete task"
              accessibilityRole="button"
              onPress={confirmDelete}
              style={({ pressed }) => [
                styles.outlineButton,
                {
                  borderColor: palette.errorBorder,
                  backgroundColor: palette.errorBackground,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              testID={TestIds.taskDetailsDeleteButton}
            >
              <Text
                style={[styles.outlineButtonText, { color: palette.error }]}
              >
                Delete
              </Text>
            </Pressable>
          </View>
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
    gap: 16,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusChipTextCompleted: {
    color: '#FFFFFF',
  },
  priorityChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  priorityChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  calendarCard: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 18,
  },
  calendarBadge: {
    alignItems: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 94,
    width: 86,
  },
  calendarMonth: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  calendarDay: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  calendarCopy: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  calendarTitle: {
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
  },
  calendarHint: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionPanel: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  outlineButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 12,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
