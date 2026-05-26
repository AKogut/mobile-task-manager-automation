import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TestIds,
  testIdForDueDateOption,
  testIdForPriority,
} from '@/constants/testIds';
import {
  taskPriorities,
  taskSchema,
  type TaskFormValues,
} from '@/features/tasks/taskSchema';
import {
  addDays,
  addMonths,
  formatCalendarMonth,
  formatDateInputValue,
  getCalendarDates,
  parseDateInputValue,
  startOfMonth,
} from '@/features/tasks/taskDates';
import {
  formatPriorityLabel,
  getPriorityColors,
} from '@/features/tasks/taskPriority';
import { getPalette } from '@/theme/palette';

type TaskFormProps = {
  defaultValues: TaskFormValues;
  screenTitle: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

type DueDatePreview = {
  weekday: string;
  month: string;
  day: string;
  year: string;
};

const quickDueDateOptions = [
  {
    id: 'today',
    label: 'Today',
    getDate: () => new Date(),
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    getDate: () => addDays(new Date(), 1),
  },
  {
    id: 'next-week',
    label: 'Next week',
    getDate: () => addDays(new Date(), 7),
  },
  {
    id: 'next-month',
    label: 'Next month',
    getDate: () => addMonths(new Date(), 1),
  },
] as const;

const calendarWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseDueDatePreview(dueDate: string): DueDatePreview {
  const date = parseDateInputValue(dueDate);

  if (!date) {
    return {
      weekday: 'Pick a date',
      month: 'Due',
      day: '--',
      year: 'YYYY-MM-DD',
    };
  }

  return {
    weekday: date.toLocaleDateString('en-US', {
      weekday: 'long',
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

export function TaskForm({
  defaultValues,
  screenTitle,
  submitLabel,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const palette = getPalette(isDarkMode);
  const insets = useSafeAreaInsets();
  const defaultDueDate = parseDateInputValue(defaultValues.dueDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    startOfMonth(defaultDueDate ?? new Date()),
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const submitTask = handleSubmit(values => {
    onSubmit(values);
  });

  const onSubmitPress = () => {
    submitTask().catch(() => undefined);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        accessibilityLabel={screenTitle}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        testID={TestIds.taskFormScreen}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [
              styles.backButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.card,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={TestIds.taskFormBackButton}
          >
            <Text style={[styles.backButtonText, { color: palette.text }]}>
              Back
            </Text>
          </Pressable>
          <Text
            style={[styles.title, { color: palette.text }]}
            testID={TestIds.taskFormTitle}
          >
            {screenTitle}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.label, { color: palette.text }]}>Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Task title"
                autoCapitalize="sentences"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Plan release notes"
                placeholderTextColor={palette.muted}
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.inputBackground,
                    borderColor: errors.title ? palette.error : palette.border,
                    color: palette.text,
                  },
                ]}
                testID={TestIds.taskTitleInput}
                value={value}
              />
            )}
          />
          {errors.title ? (
            <Text
              style={[styles.fieldError, { color: palette.error }]}
              testID={TestIds.taskTitleError}
            >
              {errors.title.message}
            </Text>
          ) : null}

          <Text style={[styles.label, { color: palette.text }]}>
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Task description"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Add helpful context"
                placeholderTextColor={palette.muted}
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: palette.inputBackground,
                    borderColor: errors.description
                      ? palette.error
                      : palette.border,
                    color: palette.text,
                  },
                ]}
                testID={TestIds.taskDescriptionInput}
                value={value}
              />
            )}
          />

          <Text style={[styles.label, { color: palette.text }]}>Priority</Text>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <View style={styles.priorityRow}>
                {taskPriorities.map(priority => {
                  const isSelected = value === priority;
                  const priorityColors = getPriorityColors(priority, palette);

                  return (
                    <Pressable
                      accessibilityLabel={`${formatPriorityLabel(
                        priority,
                      )} priority`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      key={priority}
                      onPress={() => {
                        onChange(priority);
                      }}
                      style={({ pressed }) => [
                        styles.priorityOption,
                        {
                          backgroundColor: isSelected
                            ? priorityColors.background
                            : palette.inputBackground,
                          borderColor: isSelected
                            ? priorityColors.border
                            : palette.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                      testID={testIdForPriority(priority)}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          isSelected
                            ? { color: priorityColors.text }
                            : { color: palette.text },
                        ]}
                      >
                        {formatPriorityLabel(priority)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />

          <Text style={[styles.label, { color: palette.text }]}>Due date</Text>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, onBlur, value } }) => {
              const dueDatePreview = parseDueDatePreview(value);
              const selectedDate = parseDateInputValue(value);
              const calendarDates = getCalendarDates(visibleMonth);

              const selectDueDate = (date: Date) => {
                onChange(formatDateInputValue(date));
                setVisibleMonth(startOfMonth(date));
                setIsCalendarOpen(false);
              };

              return (
                <View style={styles.dueDateSection}>
                  <View style={styles.dateInputRow}>
                    <TextInput
                      accessibilityLabel="Due date"
                      autoCapitalize="none"
                      keyboardType="numbers-and-punctuation"
                      onBlur={onBlur}
                      onChangeText={text => {
                        const parsedDate = parseDateInputValue(text);

                        if (parsedDate) {
                          setVisibleMonth(startOfMonth(parsedDate));
                        }

                        onChange(text);
                      }}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={palette.muted}
                      style={[
                        styles.input,
                        styles.dateInput,
                        {
                          backgroundColor: palette.inputBackground,
                          borderColor: errors.dueDate
                            ? palette.error
                            : palette.border,
                          color: palette.text,
                        },
                      ]}
                      testID={TestIds.taskDueDateInput}
                      value={value}
                    />
                    <Pressable
                      accessibilityLabel={
                        isCalendarOpen ? 'Hide calendar' : 'Show calendar'
                      }
                      accessibilityRole="button"
                      onPress={() => {
                        setIsCalendarOpen(current => !current);
                      }}
                      style={({ pressed }) => [
                        styles.calendarToggleButton,
                        {
                          backgroundColor: isCalendarOpen
                            ? palette.accent
                            : palette.inputBackground,
                          borderColor: isCalendarOpen
                            ? palette.accent
                            : palette.border,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                      testID={TestIds.taskDueDateCalendarButton}
                    >
                      <Text
                        style={[
                          styles.calendarToggleButtonText,
                          isCalendarOpen
                            ? styles.calendarToggleButtonTextActive
                            : { color: palette.text },
                        ]}
                      >
                        Cal
                      </Text>
                    </Pressable>
                  </View>

                  {isCalendarOpen ? (
                    <View
                      style={[
                        styles.calendarPanel,
                        {
                          backgroundColor: palette.inputBackground,
                          borderColor: palette.border,
                        },
                      ]}
                      testID={TestIds.taskDueDateCalendarPanel}
                    >
                      <View style={styles.calendarPanelHeader}>
                        <Pressable
                          accessibilityLabel="Previous month"
                          accessibilityRole="button"
                          onPress={() => {
                            setVisibleMonth(current => addMonths(current, -1));
                          }}
                          style={({ pressed }) => [
                            styles.monthButton,
                            {
                              borderColor: palette.border,
                              opacity: pressed ? 0.85 : 1,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.monthButtonText,
                              { color: palette.text },
                            ]}
                          >
                            Prev
                          </Text>
                        </Pressable>
                        <Text
                          style={[styles.monthTitle, { color: palette.text }]}
                        >
                          {formatCalendarMonth(visibleMonth)}
                        </Text>
                        <Pressable
                          accessibilityLabel="Next month"
                          accessibilityRole="button"
                          onPress={() => {
                            setVisibleMonth(current => addMonths(current, 1));
                          }}
                          style={({ pressed }) => [
                            styles.monthButton,
                            {
                              borderColor: palette.border,
                              opacity: pressed ? 0.85 : 1,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.monthButtonText,
                              { color: palette.text },
                            ]}
                          >
                            Next
                          </Text>
                        </Pressable>
                      </View>

                      <View style={styles.weekdayRow}>
                        {calendarWeekdays.map(weekday => (
                          <Text
                            key={weekday}
                            style={[
                              styles.weekdayText,
                              { color: palette.muted },
                            ]}
                          >
                            {weekday}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.calendarGrid}>
                        {calendarDates.map(calendarDate => {
                          const isSelected =
                            selectedDate !== null &&
                            formatDateInputValue(selectedDate) ===
                              calendarDate.key;

                          return (
                            <Pressable
                              accessibilityLabel={`Select ${calendarDate.key}`}
                              accessibilityRole="button"
                              accessibilityState={{ selected: isSelected }}
                              key={calendarDate.key}
                              onPress={() => {
                                selectDueDate(calendarDate.date);
                              }}
                              style={({ pressed }) => [
                                styles.calendarDayButton,
                                {
                                  backgroundColor: isSelected
                                    ? palette.accent
                                    : palette.card,
                                  borderColor: isSelected
                                    ? palette.accent
                                    : palette.border,
                                  opacity: pressed ? 0.85 : 1,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.calendarDayButtonText,
                                  isSelected
                                    ? styles.calendarDayButtonTextSelected
                                    : {
                                        color: calendarDate.isCurrentMonth
                                          ? palette.text
                                          : palette.disabled,
                                      },
                                ]}
                              >
                                {calendarDate.day}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.quickDateRow}>
                    {quickDueDateOptions.map(option => (
                      <Pressable
                        accessibilityLabel={`Set due date to ${option.label}`}
                        accessibilityRole="button"
                        key={option.id}
                        onPress={() => {
                          selectDueDate(option.getDate());
                        }}
                        style={({ pressed }) => [
                          styles.quickDateOption,
                          {
                            backgroundColor: palette.inputBackground,
                            borderColor: palette.border,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                        testID={testIdForDueDateOption(option.id)}
                      >
                        <Text
                          style={[
                            styles.quickDateOptionText,
                            { color: palette.text },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View
                    style={[
                      styles.calendarPreview,
                      {
                        backgroundColor: palette.inputBackground,
                        borderColor: palette.border,
                      },
                    ]}
                    testID={TestIds.taskDueDateCalendarPreview}
                  >
                    <View
                      style={[
                        styles.calendarBadge,
                        { backgroundColor: palette.accent },
                      ]}
                    >
                      <Text style={styles.calendarMonth}>
                        {dueDatePreview.month}
                      </Text>
                      <Text style={styles.calendarDay}>
                        {dueDatePreview.day}
                      </Text>
                    </View>
                    <View style={styles.calendarCopy}>
                      <Text
                        style={[
                          styles.calendarKicker,
                          { color: palette.accent },
                        ]}
                      >
                        Calendar
                      </Text>
                      <Text
                        style={[styles.calendarTitle, { color: palette.text }]}
                      >
                        {dueDatePreview.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.calendarSubtitle,
                          { color: palette.muted },
                        ]}
                      >
                        {dueDatePreview.month} {dueDatePreview.day},{' '}
                        {dueDatePreview.year}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
          {errors.dueDate ? (
            <Text
              style={[styles.fieldError, { color: palette.error }]}
              testID={TestIds.taskDueDateError}
            >
              {errors.dueDate.message}
            </Text>
          ) : null}

          <Pressable
            accessibilityLabel={submitLabel}
            accessibilityRole="button"
            onPress={onSubmitPress}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: palette.accent,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            testID={TestIds.taskSubmitButton}
          >
            <Text
              style={styles.submitButtonText}
              testID={TestIds.taskSubmitButtonText}
            >
              {submitLabel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 24,
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 96,
  },
  dueDateSection: {
    gap: 10,
  },
  dateInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  calendarToggleButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  calendarToggleButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  calendarToggleButtonTextActive: {
    color: '#FFFFFF',
  },
  calendarPanel: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  calendarPanelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  monthButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  monthButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  monthTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarDayButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    width: '13.2%',
  },
  calendarDayButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  calendarDayButtonTextSelected: {
    color: '#FFFFFF',
  },
  quickDateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickDateOption: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickDateOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  calendarPreview: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  calendarBadge: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 76,
    width: 70,
  },
  calendarMonth: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  calendarDay: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  calendarCopy: {
    flex: 1,
    gap: 3,
  },
  calendarKicker: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  calendarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  calendarSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityTextSelected: {
    color: '#FFFFFF',
  },
  fieldError: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
