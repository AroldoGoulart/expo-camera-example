import React from 'react';
import { StyleSheet, Button, View, Image } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';

export function HomeScreen(props) {
    const { route: { params: { video: { uri } } } } = props
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{ uri }}
                resizeMode="cover"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttons}>
                {
                    /*
                    aqui voce pode configura a ação que quiser, 
                    mas deixei assim para exemplo que de  
                    controle de video
                    */
                }
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View>

            <Image
                source={require("../../../assets/logo.png")}
                style={{
                    height: 60,
                    width: 60,
                    position: 'absolute',
                    right: 10,
                    bottom: 50,
                    opacity: 0.6,
                    backgroundColor: "transparent"
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    buttons: {
    },
});
