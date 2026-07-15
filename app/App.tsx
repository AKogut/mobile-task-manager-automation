import { TestIds } from '@/constants/testIds';
import { RootNavigator } from '@/navigation/RootNavigator';
import {
  bootstrapPersistence,
  getUITestSeedTasks,
  isUITestAuthedRun,
  isUITestRun,
  type RootProps,
} from '@/testing/uiTestHarness';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(props: RootProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const isUITest = isUITestRun(props);
  const isUITestAuthed = isUITestAuthedRun(props);
  const uiTestTasks = props.uiTestTasks;

  useEffect(() => {
    bootstrapPersistence(
      isUITest,
      isUITestAuthed,
      getUITestSeedTasks({ uiTestTasks }),
    ).catch(() => undefined);
  }, [isUITest, isUITestAuthed, uiTestTasks]);

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
