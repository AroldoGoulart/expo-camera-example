import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Video } from 'expo';

export default class Preview extends PureComponent {
  render() {
    const { 
      video, 
      onReadyForDisplay,
      onLoad,
      onLoadStart,
      handleVideoRef,
      onPlaybackStatusUpdate
    } = this.props;
    if (video && video.uri) {
      const { height, width } = Dimensions.get('window');
      return (
        <View style={styles.container}>
          <Video 
            source={{ uri: video.uri }}
            style={[styles.image, { height, width }]}
            rate={1.0}
            isMuted={false}
            resizeMode="cover"
            volume={0.5}
            isLooping
            ref={handleVideoRef}
            shouldPlay
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, 
    left: 0,
    width: '100%',
    height: '100%'
  },
  image: {
    flex: 1,
    transform: [{
      scaleX: -1
    }]
  }
})
