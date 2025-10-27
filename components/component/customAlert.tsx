import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';

interface AlertBoxProps {
  visible?: boolean;
  message?: string;
  fadeDuration?: number;
  displayDuration?: number;
}

export const AlertBox = ({
  visible = false,
  message = '',
  fadeDuration = 300,
  displayDuration = 5000,
}: AlertBoxProps) => {
  const [isShown, setIsShown] = useState<boolean>(visible);
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  const progressAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setIsShown(true);
      opacity.setValue(0);
      progressAnim.setValue(1);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: displayDuration,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (isShown) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsShown(false);
          progressAnim.stopAnimation(() => progressAnim.setValue(1));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, fadeDuration, displayDuration, isShown]);

  if (!isShown) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View style={[styles.mainContainer, { opacity }]}>
        <View style={styles.container}>
          <Text style={styles.alertMessage}>{message}</Text>
        </View>

        {/* animated progress bar */}
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    zIndex: 9999,
  },

  mainContainer: {
    width: '90%',
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'hsla(205, 200%, 24%, .2)',
    overflow: 'hidden',
  },

  container: {
    padding: 10,
  },

  alertMessage: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  progressBar: {
    backgroundColor: 'hsla(205, 200%, 24%, .55)',
    height: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
