
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import AppNavigator from './navigation/AppNavigator';
import {ApiProvider} from './context/ApiContext';
import {COLORS} from './constants/theme';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ApiProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="light-content"
              backgroundColor={COLORS.primary}
              translucent={false}
            />
            <AppNavigator />
          </NavigationContainer>
        </ApiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
