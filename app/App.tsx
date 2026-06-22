import { TestIds } from '@/constants/testIds';
import { RootNavigator } from '@/navigation/RootNavigator';
import {
  bootstrapPersistence,
  isUITestRun,
  type RootProps,
} from '@/testing/uiTestHarness';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(props: RootProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const isUITest = isUITestRun(props);

  useEffect(() => {
    void bootstrapPersistence(isUITest);
  }, [isUITest]);

  return (
    <SafeAreaProvider>
      <View style={styles.root} testID={TestIds.appRoot}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
