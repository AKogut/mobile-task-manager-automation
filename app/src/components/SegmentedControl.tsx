import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Palette } from '@/theme/palette';

export type SegmentedControlOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

type SegmentedControlProps<TValue extends string = string> = {
  options: Array<SegmentedControlOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  palette: Palette;
  testIdForOption?: (value: TValue) => string;
  accessibilityLabelForOption?: (
    option: SegmentedControlOption<TValue>,
  ) => string;
  renderIcon?: (
    option: SegmentedControlOption<TValue>,
    isSelected: boolean,
  ) => ReactNode;
};

export function SegmentedControl<TValue extends string = string>({
  options,
  value,
  onChange,
  palette,
  testIdForOption,
  accessibilityLabelForOption,
  renderIcon,
}: SegmentedControlProps<TValue>) {
  return (
    <View
      style={[
        styles.segmentedControl,
        {
          backgroundColor: palette.inputBackground,
          borderColor: palette.border,
        },
      ]}
    >
      {options.map(option => {
        const isSelected = value === option.value;

        return (
          <Pressable
            accessibilityLabel={accessibilityLabelForOption?.(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => {
              onChange(option.value);
            }}
            style={({ pressed }) => [
              styles.segmentButton,
              {
                backgroundColor: isSelected ? palette.accent : 'transparent',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={testIdForOption?.(option.value)}
          >
            {renderIcon?.(option, isSelected)}
            <Text
              style={[
                styles.segmentButtonText,
                { color: isSelected ? palette.card : palette.text },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  segmentButtonText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
