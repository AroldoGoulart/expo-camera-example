import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { Ionicons } from '@expo/vector-icons';
import TouchablePulse from './TouchablePulse';

const AnimatableTouchablePulse = Animatable.createAnimatableComponent(TouchablePulse);

export default class CameraOverlay extends PureComponent {
  render() {
    const { onLongPress, video, isRecording, videoIsLoading, onPress, onPressOut, handleRecordButtonRef } = this.props;
    if (isRecording) return null;
    const mediaIsPreviewed = !!(video && video.uri);
    let iconName = mediaIsPreviewed ?
      'ios-close-circle-outline' : 'ios-radio-button-off';
    iconName = isRecording ? 'ios-radio-button-on' : iconName;
    const iconColor = mediaIsPreviewed ? 'white' : 'orange';
    let iconSize = mediaIsPreviewed ? 40 : 100;
    iconSize = isRecording ? 110 : iconSize;

    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <AnimatableTouchablePulse
            style={styles.button}
            onPress={onPress}
            onPressOut={onPressOut}
            onLongPress={onPress}
            delayLongPress={500}
            ref={handleRecordButtonRef}
            scaleToValue={1.2}
          >
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
          </AnimatableTouchablePulse>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFill,
    zIndex: 2
  },
  buttons: {
    alignItems: 'center'
  },
  loader: {
    fontSize: 100
  },
  button: {
    padding: 15,
    paddingBottom: 15,
    ...ifIphoneX({
      marginBottom: getBottomSpace() - 5
    }),
    shadowRadius: 10,
    shadowColor: "#ffffff60",
    shadowOpacity: 0.6,
    elevation: 10,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white'
  }
});
