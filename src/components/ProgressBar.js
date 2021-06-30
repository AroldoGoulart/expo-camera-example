import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

function ProgressBar(props) {
  const { animationStyle, isRecording, video, cancelMedia, onEnd } = props;
  let { progressText } = props;

  const videoIsReady = !isRecording && !!(video && video.uri);
  progressText = (!isRecording && !(video && video.uri) && !progressText) ? '...' : progressText;

  if (!isRecording && !(video && video.uri)) {
    return null;
  }

  useEffect(() => {
    if (videoIsReady && progressText <= 0) {
      onEnd()
    }
  }, [videoIsReady])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wrapper, animationStyle]}>
        {!videoIsReady ? (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              {progressText}
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