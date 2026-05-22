import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TaskForm } from '@/features/tasks/TaskForm';
import type { TaskFormValues } from '@/features/tasks/taskSchema';
import { useTaskStore } from '@/features/tasks/taskStore';
import type { AuthenticatedStackParamList } from '@/navigation/RootNavigator';

type AddTaskScreenProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'AddTask'
>;

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const addTask = useTaskStore(state => state.addTask);

  const submitTask = (values: TaskFormValues) => {
    const task = addTask(values);

    navigation.replace('TaskDetails', { taskId: task.id });
  };

  return (
    <TaskForm
      defaultValues={defaultValues}
      screenTitle="Add task"
      submitLabel="Create task"
      onCancel={navigation.goBack}
      onSubmit={submitTask}
    />
  );
}
