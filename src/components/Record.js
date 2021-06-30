import React from 'react';
import { View, StyleSheet, Animated, Easing, LayoutAnimation, Text, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Camera } from 'expo-camera';

import ProgressBar from './ProgressBar';
import CameraOverlay from './Overlay';
import { countdown } from '../utils/countdown';
import { VIDEO_DURATION, VIDEO_CAMERA_OPTIONS } from '../utils/cameraConfig';

const initial_state = {
  isRecording: false,
  video: null,
  videoIsLoading: false,
  progressText: VIDEO_DURATION / 1000,
  pause: false
}
export default class Record extends React.Component {
  constructor() {
    super();
    this.state = {
      ...initial_state
    };

    this.progressAnimation = new Animated.Value(0);
    this.progressTranslateX = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['-200%', '0%']
    });
    this.progressFlex = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    this.progressBackgroundColor = this.progressAnimation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: ['#ff470f', '#ff3860', '#b86bff', '#2196f3', '#b86bff', '#ff7600', '#3273dc', 'red', '#FF5F14']
    })

    this.isRecording = false;
    this.recordingWasManuallyCancelled = false;

    this.handleCameraRef = this.handleCameraRef.bind(this);
    this.handleRecordButtonRef = this.handleRecordButtonRef.bind(this);
    this.onRecordVideo = this.onRecordVideo.bind(this);
    this.cancelMedia = this.cancelMedia.bind(this);

    this.animateProgressBar = this.animateProgressBar.bind(this);
    this.animationStyle = this.animationStyle.bind(this);
    this.updateProgressText = this.updateProgressText.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
  }

  playSound() {
    this.props.playSound()
  }

  stopSound() {
    this.props.stopSound()
  }

  
  handleCameraRef(ref) {
    this.camera = ref;
  }

  handleRecordButtonRef(ref) {
    this.recordButton = ref;
  }

  handlerAnimation(stop = false, reset = false) {
    if(stop) {
      Animated.timing(this.progressAnimation, {
        toValue: 1,
        useNativeDriver: false,
        easing: Easing.linear,
        duration: VIDEO_DURATION
      }).stop()
      return 
    }

    if(reset) {
      this.progressAnimation = new Animated.Value(0)
      return
    }

    Animated.timing(this.progressAnimation, {
      toValue: 1,
      useNativeDriver: false,
      easing: Easing.linear,
      duration: VIDEO_DURATION
    }).start()
  }

  updateProgressText(progressText) {
    if(this.state.pause) {
      return 
    }
    this.setState({ progressText });
  }

  animateProgressBar() {
    this.progressAnimation.setValue(0);
      Animated.timing(this.progressAnimation, {
        toValue: 1,
        useNativeDriver: false,
        easing: Easing.linear,
        duration: VIDEO_DURATION
      }).start();
  }

  animationStyle() {
    const { progressFlex: flex, progressBackgroundColor: backgroundColor } = this;
    return {
      flex,
      backgroundColor
    }
  }

  async onRecordVideo() {
    if (!!this.camera) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ isRecording: true }, async () => {
        this.isRecording = true; // variable used for other functions that need to know if it's recording without waiting for state
        console.log('RECORDING STARTED');

        this.animateProgressBar();
        this.startCountdown();
        this.playSound()

        const video = await this.camera.recordAsync(VIDEO_CAMERA_OPTIONS)

        this.stopSound()
        this.isRecording = false;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ videoIsLoading: false, isRecording: false, video });
      })
    }
  }

  cancelMedia() {
    this.setState({ video: null });
  }
  
  startCountdown() {
    const endDate = Date.now() + VIDEO_DURATION;
    this.setState({ 
      progressText: VIDEO_DURATION / 1000 
    }, () => countdown(endDate, this.updateProgressText, this.state.pause));
  }

  resetAll() {
    this.progressAnimation = new Animated.Value(0);
    this.progressTranslateX = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['-200%', '0%']
    });
    this.progressFlex = this.progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    this.progressBackgroundColor = this.progressAnimation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: ['#ff470f', '#ff3860', '#b86bff', '#2196f3', '#b86bff', '#ff7600', '#3273dc', 'red', '#FF5F14']
    })

    this.isRecording = false;
    this.recordingWasManuallyCancelled = false;

    this.handleCameraRef = this.handleCameraRef.bind(this);
    this.handleRecordButtonRef = this.handleRecordButtonRef.bind(this);
    this.onRecordVideo = this.onRecordVideo.bind(this);
    this.cancelMedia = this.cancelMedia.bind(this);

    this.animateProgressBar = this.animateProgressBar.bind(this);
    this.animationStyle = this.animationStyle.bind(this);
    this.updateProgressText = this.updateProgressText.bind(this);
    this.startCountdown = this.startCountdown.bind(this);

    this.setState({ ...initial_state })
  }

  resumeVideo() {
      this.camera.resumePreview()
      this.setState({ pause: false })
      this.handlerAnimation()
  }

  pauseVideo() {
      this.camera.pausePreview()
      this.setState({ pause: true })
      this.handlerAnimation(true)
  }

  render() {
    const { video, isRecording, videoIsLoading, progressText } = this.state;

    return (
      <View style={styles.container}>

        <Camera
          useCamera2Api
          type={this.props.cameraMode}
          style={styles.container}
          ref={(ref) => {
            this.camera = ref
          }}
        />

        <ProgressBar
          video={video}
          isRecording={isRecording}
          animationStyle={this.animationStyle()}
          progressText={progressText}
          cancelMedia={this.cancelMedia}
          videoIsLoading={videoIsLoading}
          //key={`${isRecording}_${VIDEO_DURATION}`}
          onEnd={() => {
            this.props.navigation.dispatch(
              CommonActions.navigate({
                name: 'Home',
                params: {
                  video
                },
              })
            )
            this.setState({ video: false, progressText: VIDEO_DURATION / 1000 })
          }}
        />

        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 50,
            backgroundColor: "red",
            padding: 10,
          }} 
          onPress={() => this.pauseVideo()}
        >
          <Text>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 0,
            backgroundColor: "yellow",
            padding: 10,
          }} 
          onPress={() => this.resumeVideo()}
        >
          <Text>Resume</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 50*2,
            backgroundColor: "orange",
            padding: 10,
          }} 
          onPress={() =>  this.resetAll()}
        >
          <Text>Reset</Text>
        </TouchableOpacity>

        <CameraOverlay
          onPress={() => this.onRecordVideo()}
          video={video}
          isRecording={isRecording}
        />
        {
          isRecording ? null : this.props.children
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})