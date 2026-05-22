import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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

import { DEMO_CREDENTIALS } from '@/constants/auth';
import { APP_NAME } from '@/constants/app';
import { TestIds } from '@/constants/testIds';
import { useAuthStore } from '@/features/auth/authStore';
import { loginSchema, type LoginFormValues } from '@/features/auth/loginSchema';
import { getPalette } from '@/theme/palette';

export function LoginScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const palette = getPalette(isDarkMode);
  const insets = useSafeAreaInsets();

  const login = useAuthStore(state => state.login);
  const isSubmitting = useAuthStore(state => state.isSubmitting);
  const authError = useAuthStore(state => state.authError);
  const clearAuthError = useAuthStore(state => state.clearAuthError);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const submitLogin = handleSubmit(async values => {
    await login(values.email, values.password);
  });

  const onSignInPress = () => {
    submitLogin().catch(() => undefined);
  };

  return (
    <KeyboardAvoidingView
      accessibilityLabel="Login screen keyboard container"
      style={[styles.flex, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID={TestIds.loginKeyboardContainer}
    >
      <ScrollView
        accessibilityLabel="Login screen"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        testID={TestIds.loginScreen}
      >
        <View style={styles.header} testID={TestIds.loginHeader}>
          <Text
            style={[styles.eyebrow, { color: palette.accent }]}
            testID={TestIds.loginEyebrow}
          >
            Welcome back
          </Text>
          <Text
            style={[styles.title, { color: palette.text }]}
            testID={TestIds.loginTitle}
          >
            {APP_NAME}
          </Text>
          <Text
            style={[styles.subtitle, { color: palette.muted }]}
            testID={TestIds.loginSubtitle}
          >
            Sign in to manage your tasks across devices.
          </Text>
        </View>

        {authError ? (
          <View
            style={[
              styles.banner,
              {
                backgroundColor: palette.errorBackground,
                borderColor: palette.errorBorder,
              },
            ]}
            testID={TestIds.authErrorBanner}
            accessibilityLabel={authError}
            accessibilityRole="alert"
          >
            <Text
              style={[styles.bannerText, { color: palette.error }]}
              testID={TestIds.authErrorMessage}
            >
              {authError}
            </Text>
          </View>
        ) : null}

        <View
          style={[
            styles.card,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
          testID={TestIds.loginFormCard}
        >
          <Text
            style={[styles.label, { color: palette.text }]}
            testID={TestIds.loginEmailLabel}
          >
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isSubmitting}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={text => {
                  clearAuthError();
                  onChange(text);
                }}
                placeholder="you@example.com"
                placeholderTextColor={palette.muted}
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.inputBackground,
                    borderColor: errors.email ? palette.error : palette.border,
                    color: palette.text,
                  },
                ]}
                testID={TestIds.loginEmailInput}
                value={value}
              />
            )}
          />
          {errors.email ? (
            <Text
              style={[styles.fieldError, { color: palette.error }]}
              testID={TestIds.loginEmailError}
            >
              {errors.email.message}
            </Text>
          ) : null}

          <Text
            style={[styles.label, { color: palette.text }]}
            testID={TestIds.loginPasswordLabel}
          >
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="password"
                editable={!isSubmitting}
                onBlur={onBlur}
                onChangeText={text => {
                  clearAuthError();
                  onChange(text);
                }}
                placeholder="Enter your password"
                placeholderTextColor={palette.muted}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.inputBackground,
                    borderColor: errors.password
                      ? palette.error
                      : palette.border,
                    color: palette.text,
                  },
                ]}
                testID={TestIds.loginPasswordInput}
                value={value}
              />
            )}
          />
          {errors.password ? (
            <Text
              style={[styles.fieldError, { color: palette.error }]}
              testID={TestIds.loginPasswordError}
            >
              {errors.password.message}
            </Text>
          ) : null}

          <Pressable
            accessibilityLabel={isSubmitting ? 'Signing in' : 'Sign in'}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={onSignInPress}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: palette.accent,
                opacity: isSubmitting ? 0.7 : pressed ? 0.9 : 1,
              },
            ]}
            testID={TestIds.loginSubmitButton}
          >
            {isSubmitting ? (
              <ActivityIndicator
                accessibilityLabel="Signing in loading indicator"
                color="#FFFFFF"
                testID={TestIds.loginSubmitLoading}
              />
            ) : (
              <Text
                style={styles.buttonText}
                testID={TestIds.loginSubmitButtonText}
              >
                Sign in
              </Text>
            )}
          </Pressable>
        </View>

        <View
          style={[
            styles.hintCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
          testID={TestIds.demoCredentialsCard}
        >
          <Text
            style={[styles.hintTitle, { color: palette.text }]}
            testID={TestIds.demoCredentialsTitle}
          >
            Demo credentials
          </Text>
          <Text
            style={[styles.hintBody, { color: palette.muted }]}
            testID={TestIds.demoCredentialsEmail}
          >
            Email: {DEMO_CREDENTIALS.email}
          </Text>
          <Text
            style={[styles.hintBody, { color: palette.muted }]}
            testID={TestIds.demoCredentialsPassword}
          >
            Password: {DEMO_CREDENTIALS.password}
          </Text>
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
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  bannerText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
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
  fieldError: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hintCard: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    padding: 16,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
