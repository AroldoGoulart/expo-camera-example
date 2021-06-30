
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Record from '../../components/Record';
import { useNavigation } from '@react-navigation/native';
import { Camera } from "expo-camera"
import { Audio } from 'expo-av';

export function VideoScreen() {
    const [hasPermission, setHasPermission] = useState(false);
    const [sound, setSound] = useState();
    const [cameraMode, setCameraMode] = useState(false);
    const navigation = useNavigation()

    const playSound = useCallback(
        async function playSound() {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(
                // your sound here
                require('../../musics/rude.mp3')
            );
            setSound(sound);

            console.log('Playing Sound');
            await sound.playAsync();
        },
        [sound],
    )

    const stopSound = useCallback(
        async function stopSound() {
            await sound.unloadAsync();
        },
        [sound],
    )

    useEffect(() => {
        return sound
            ? () => {
                //console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const getPermissions = useCallback(
        async () => {
            const { status } = await Camera.requestPermissionsAsync();
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            setHasPermission(status === 'granted');
        },
        [sound, hasPermission],
    )

    useEffect(() => {
        getPermissions()
    }, [])

    if (!hasPermission) {
        return (
            <View style={styles.notAllowed}>
                <Text>Necessario permissões</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Record
                stopSound={stopSound}
                playSound={playSound}
                navigation={navigation}
                cameraMode={cameraMode ? Camera.Constants.Type.back : Camera.Constants.Type.front}
            >
                <TouchableOpacity
                    onPress={() => {
                        setCameraMode(!cameraMode)
                    }}
                    style={styles.touchable}
                >
                    <Text style={styles.text}>
                        Trocar
                    </Text>
                </TouchableOpacity>
            </Record>
        </View>
    );
}

const styles = StyleSheet.create({
    touchable: {
        position: "absolute",
        backgroundColor: "blue",
        bottom: 120,
        right: 20,
        zIndex: 5,
        padding: 10
    },
    text: {
        color: "white"
    },
    notAllowed: {
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0,0,255, 0.4)"
    }
});

