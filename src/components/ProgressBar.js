import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

function ProgressBar(props) {
  const isFocused = useIsFocused()
  const { animationStyle, isRecording, video, cancelMedia, onEnd } = props;

  const [progressText2, setProgressText2] = useState(props.progressText)
  const videoIsReady = !isRecording && !!(video && video.uri);

  useEffect(() => {
    const progressText = (!isRecording && !(video && video.uri) && !props.progressText2) ? '...' : progressText2;
    setProgressText2(progressText)
  }, [isRecording, video])

  if (!isRecording && !(video && video.uri)) {
    return null;
  }

  useEffect(() => {
    if (videoIsReady && progressText2 <= 0) {
      onEnd()
    }
  }, [videoIsReady])

  return (
    <View key={progressText2} style={styles.container}>
      <Animated.View style={[styles.wrapper, animationStyle]}>
        {!videoIsReady ? (
          <View style={styles.textWrapper}>
            <Text key={`${progressText2}_text`} style={styles.text}>
              {progressText2}
            </Text>
          </View>
        ) : (
          <View style={styles.inner}>
            <TouchableOpacity style={styles.cancel} onPress={cancelMedia}>
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEnd} style={styles.button}>
              <Text>
                Postar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  )
}

const padding = 20;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 3,
    backgroundColor: 'white',
  },
  wrapper: {
    backgroundColor: 'red',
    height: padding * 3 + getBottomSpace(),
    paddingBottom: getBottomSpace(),
  },
  textWrapper: {
    position: 'absolute',
    top: padding / 2,
    right: padding / 2
  },
  text: {
    textAlign: 'right',
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold'
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: padding / 2,
    paddingTop: padding / 2
  },
  button: {
    padding: padding / 2,
    paddingHorizontal: padding * 0.75,
    borderRadius: padding,
    backgroundColor: 'white'
  },
  cancel: {
    padding: padding / 2,
    paddingHorizontal: padding * 0.75,
    borderRadius: padding,
  },
  cancelText: {
    color: 'white'
  }
});

export default ProgressBar