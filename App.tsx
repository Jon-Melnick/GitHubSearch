/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'jotai';
import {MainNavigator} from './src/navigation/Main';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GitHubProvider} from './src/stores/GitHubContext';

function App(): JSX.Element {
  return (
    <Provider>
      <SafeAreaProvider>
        <GitHubProvider>
          <MainNavigator />
        </GitHubProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
