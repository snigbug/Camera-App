import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

import {
  useFonts,
  Inter_900Black,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_400Regular,
} from '@expo-google-fonts/inter';
import {
  AmaticSC_400Regular,
  AmaticSC_700Bold,
} from '@expo-google-fonts/amatic-sc';

import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './AnimatedSplashScreen';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ThemeProvider, Theme } from '@aws-amplify/ui-react-native';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react-native';
// import ampplifyconfig from '@/amplifyconfiguration.json';
import BiometricProvider from './BiometricsProvider';

import Purchases from 'react-native-purchases';
const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;

import { vexo } from 'vexo-analytics';
vexo(process.env.EXPO_PUBLIC_VEXO_API_KEY || '');

// Amplify.configure(ampplifyconfig);

const theme: Theme = {
  tokens: {
    colors: {
      brand: {
        primary: 'red',
      },

      background: {
        primary: '{colors.gray}',
      },
      font: {
        primary: 'black',
      },
    },
  },
};

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    InterSemi: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    InterBlack: Inter_900Black,

    Amatic: AmaticSC_400Regular,
    AmaticBold: AmaticSC_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'ios' && REVENUECAT_IOS_KEY) {
      Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  const showAnimatedSplash = !appReady || !splashAnimationFinished;
  if (showAnimatedSplash) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            setSplashAnimationFinished(true);
          }
        }}
      />
    );
  }

  return (
    <BiometricProvider>
      <Authenticator.Provider>
        <ThemeProvider theme={theme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Animated.View style={{ flex: 1 }} entering={FadeIn}>
              <Stack screenOptions={{}}>
                <Stack.Screen name="index" options={{ title: 'Updated' }} />
              </Stack>
            </Animated.View>
          </GestureHandlerRootView>
        </ThemeProvider>
      </Authenticator.Provider>
    </BiometricProvider>
  );
}