import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TaskForm } from '@/features/tasks/TaskForm';
import type { TaskFormValues } from '@/features/tasks/taskSchema';
import { selectTaskById, useTaskStore } from '@/features/tasks/taskStore';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';
import { getPalette } from '@/theme/palette';

type EditTaskScreenProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'EditTask'
>;

export function EditTaskScreen({ navigation, route }: EditTaskScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const palette = getPalette(isDarkMode);
  const insets = useSafeAreaInsets();
  const task = useTaskStore(selectTaskById(route.params.taskId));
  const updateTask = useTaskStore(state => state.updateTask);

  if (!task) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.notFoundContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
            backgroundColor: palette.background,
          },
        ]}
      >
        <View style={styles.notFoundActions}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={({ pressed }) => [
              styles.notFoundButton,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.notFoundButtonText, { color: palette.text }]}>
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
              styles.notFoundButton,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.notFoundButtonText, { color: palette.text }]}>
              Home
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.notFoundTitle, { color: palette.text }]}>
          Task not found
        </Text>
        <Text style={[styles.notFoundBody, { color: palette.muted }]}>
          This task may have been deleted or is no longer available.
        </Text>
      </ScrollView>
    );
  }

  const defaultValues: TaskFormValues = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
  };

  const submitTask = (values: TaskFormValues) => {
    updateTask(task.id, values);

    navigation.replace('TaskDetails', { taskId: task.id });
  };

  return (
    <TaskForm
      defaultValues={defaultValues}
      screenTitle="Edit task"
      submitLabel="Save task"
      onCancel={navigation.goBack}
      onSubmit={submitTask}
    />
  );
}

const styles = StyleSheet.create({
  notFoundContent: {
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 24,
  },
  notFoundActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  notFoundButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notFoundButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  notFoundBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});
