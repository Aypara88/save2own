import React, { useMemo, useRef } from 'react';
import { Animated, Pressable, PressableProps, Platform, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

export type BouncePressableProps = PressableProps & {
  children: React.ReactNode;
  scaleFrom?: number;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const BouncePressable = ({ children, onPress, onPressIn, onPressOut, scaleFrom = 0.98, style, testID, ...rest }: BouncePressableProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      friction: 5,
      tension: 200,
    }).start();
  };

  const handlePressIn: NonNullable<PressableProps['onPressIn']> = (e) => {
    try { if (Platform.OS !== 'web') Haptics.selectionAsync(); } catch (err) { console.log('Haptics error', err); }
    animateTo(scaleFrom);
    onPressIn?.(e);
  };

  const handlePressOut: NonNullable<PressableProps['onPressOut']> = (e) => {
    animateTo(1);
    onPressOut?.(e);
  };

  const handlePress: NonNullable<PressableProps['onPress']> = (e) => {
    onPress?.(e);
  };

  const animatedStyle = useMemo(() => ({ transform: [{ scale }] }), [scale]);

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} {...rest} testID={testID}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
};

export default React.memo(BouncePressable);
