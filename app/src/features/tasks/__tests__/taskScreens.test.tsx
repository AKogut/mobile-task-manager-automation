import { Alert } from 'react-native';
import {
  act,
  create,
  type ReactTestInstance,
  type ReactTestRenderer,
} from 'react-test-renderer';

import {
  TestIds,
  testIdForPriorityFilter,
  testIdForStatusFilter,
  testIdForTaskSort,
} from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import { useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';
import { AddTaskScreen } from '@/screens/AddTaskScreen';
import { EditTaskScreen } from '@/screens/EditTaskScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { TaskDetailsScreen } from '@/screens/TaskDetailsScreen';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();
const activeRenderers: ReactTestRenderer[] = [];

jest.mock('react-native', () => {
  const React = require('react');
  const ReactNative = jest.requireActual('react-native');

  function MockFlatList({
    data = [],
    keyExtractor,
    ListEmptyComponent,
    ListHeaderComponent,
    renderItem,
    ...props
  }: {
    data?: unknown[];
    keyExtractor?: (item: unknown, index: number) => string;
    ListEmptyComponent?: unknown;
    ListHeaderComponent?: unknown;
    renderItem: (info: {
      item: unknown;
      index: number;
      separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: () => void;
      };
    }) => unknown;
    [key: string]: unknown;
  }) {
    const header =
      typeof ListHeaderComponent === 'function'
        ? React.createElement(ListHeaderComponent)
        : ListHeaderComponent;
    const empty =
      typeof ListEmptyComponent === 'function'
        ? React.createElement(ListEmptyComponent)
        : ListEmptyComponent;
    const items =
      data.length > 0
        ? data.map((item, index) =>
            React.createElement(
              ReactNative.View,
              { key: keyExtractor?.(item, index) ?? String(index) },
              renderItem({
                item,
                index,
                separators: {
                  highlight: jest.fn(),
                  unhighlight: jest.fn(),
                  updateProps: jest.fn(),
                },
              }),
            ),
          )
        : empty;

    return React.createElement(ReactNative.View, props, header, items);
  }

  Object.defineProperty(ReactNative, 'FlatList', {
    value: MockFlatList,
  });

  return ReactNative;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const baseNavigation = {
  goBack: mockGoBack,
  navigate: mockNavigate,
  replace: mockReplace,
} as never;

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Write launch notes',
    description: 'Prepare notes for the release.',
    priority: 'medium',
    dueDate: '2026-06-03',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Fix checkout bug',
    description: 'Regression in payments.',
    priority: 'high',
    dueDate: '2026-06-01',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Archive old board',
    description: 'Cleanup completed work.',
    priority: 'low',
    dueDate: '2026-06-10',
    completed: true,
  },
];

function flushPromises(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

async function renderWithAct(
  element: React.ReactElement,
): Promise<ReactTestRenderer> {
  let renderer: ReactTestRenderer | null = null;

  await act(async () => {
    renderer = create(element);
    await flushPromises();
  });

  if (!renderer) {
    throw new Error('Expected component renderer');
  }

  activeRenderers.push(renderer);

  return renderer;
}

function getProp<T>(node: ReactTestInstance, propName: string): T {
  return node.props[propName] as T;
}

function changeText(node: ReactTestInstance, value: string): void {
  getProp<(nextValue: string) => void>(node, 'onChangeText')(value);
}

function press(node: ReactTestInstance): void {
  getProp<() => void>(node, 'onPress')();
}

function getChildren(node: ReactTestInstance): unknown {
  return (node.props as { children?: unknown }).children;
}

describe('task screen flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({ tasks: [] });
    useAuthStore.setState({
      user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      token: 'token',
    });
  });

  afterEach(() => {
    act(() => {
      activeRenderers.forEach(renderer => {
        renderer.unmount();
      });
      activeRenderers.length = 0;
    });
  });

  it('creates a task from the add task screen', async () => {
    const renderer = await renderWithAct(
      <AddTaskScreen navigation={baseNavigation} route={{} as never} />,
    );
    const root = renderer.root;

    await act(async () => {
      changeText(
        root.findByProps({ testID: TestIds.taskTitleInput }),
        'Build screen tests',
      );
      changeText(
        root.findByProps({ testID: TestIds.taskDescriptionInput }),
        'Cover the create task path.',
      );
      changeText(
        root.findByProps({ testID: TestIds.taskDueDateInput }),
        '2026-06-05',
      );
      press(root.findByProps({ testID: 'task-priority-option-high' }));
      press(root.findByProps({ testID: TestIds.taskSubmitButton }));
      await flushPromises();
    });

    const createdTask = useTaskStore.getState().tasks[0];
    expect(createdTask).toMatchObject({
      title: 'Build screen tests',
      description: 'Cover the create task path.',
      priority: 'high',
      dueDate: '2026-06-05',
      completed: false,
    });
    expect(mockReplace).toHaveBeenCalledWith('TaskDetails', {
      taskId: createdTask?.id,
    });
  });

  it('edits an existing task without resetting completion state', async () => {
    useTaskStore.setState({ tasks: [{ ...sampleTasks[0]!, completed: true }] });

    const renderer = await renderWithAct(
      <EditTaskScreen
        navigation={baseNavigation}
        route={{ params: { taskId: 'task-1' } } as never}
      />,
    );
    const root = renderer.root;

    await act(async () => {
      changeText(
        root.findByProps({ testID: TestIds.taskTitleInput }),
        'Update launch notes',
      );
      changeText(
        root.findByProps({ testID: TestIds.taskDueDateInput }),
        '2026-06-07',
      );
      press(root.findByProps({ testID: TestIds.taskSubmitButton }));
      await flushPromises();
    });

    expect(useTaskStore.getState().tasks[0]).toMatchObject({
      id: 'task-1',
      title: 'Update launch notes',
      dueDate: '2026-06-07',
      completed: true,
    });
    expect(mockReplace).toHaveBeenCalledWith('TaskDetails', {
      taskId: 'task-1',
    });
  });

  it('marks a task complete and deletes it from details', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    useTaskStore.setState({ tasks: [sampleTasks[0]!] });

    const renderer = await renderWithAct(
      <TaskDetailsScreen
        navigation={baseNavigation}
        route={{ params: { taskId: 'task-1' } } as never}
      />,
    );
    const root = renderer.root;

    await act(async () => {
      press(root.findByProps({ testID: TestIds.taskDetailsCompleteButton }));
    });

    expect(useTaskStore.getState().tasks[0]?.completed).toBe(true);

    await act(async () => {
      press(root.findByProps({ testID: TestIds.taskDetailsDeleteButton }));
    });

    const deleteButton = alertSpy.mock.calls[0]?.[2]?.[1];

    await act(async () => {
      deleteButton?.onPress?.();
    });

    expect(useTaskStore.getState().tasks).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith('Main');
  });

  it('searches, filters, sorts, and completes from the task list', async () => {
    useTaskStore.setState({ tasks: sampleTasks });

    const renderer = await renderWithAct(<HomeScreen />);
    const root = renderer.root;

    await act(async () => {
      changeText(
        root.findByProps({ testID: TestIds.taskSearchInput }),
        'checkout',
      );
    });

    expect(
      getChildren(root.findByProps({ testID: `${TestIds.taskItemTitle}-0` })),
    ).toBe('Fix checkout bug');

    await act(async () => {
      press(root.findByProps({ testID: testIdForStatusFilter('completed') }));
    });

    expect(
      root.findByProps({ testID: TestIds.taskNoResultsCard }),
    ).toBeTruthy();

    await act(async () => {
      changeText(root.findByProps({ testID: TestIds.taskSearchInput }), '');
      press(root.findByProps({ testID: testIdForStatusFilter('all') }));
      press(root.findByProps({ testID: testIdForPriorityFilter('high') }));
      press(root.findByProps({ testID: testIdForTaskSort('priority') }));
    });

    expect(
      getChildren(root.findByProps({ testID: `${TestIds.taskItemTitle}-0` })),
    ).toBe('Fix checkout bug');

    await act(async () => {
      press(root.findByProps({ testID: `${TestIds.taskToggleButton}-0` }));
    });

    expect(
      useTaskStore.getState().tasks.find(task => task.id === 'task-2'),
    ).toMatchObject({
      completed: true,
    });
  });
});
