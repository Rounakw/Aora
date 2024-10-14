import { View, Text, Image, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants';
import { ResizeMode, Video } from 'expo-av';
import { usePathname } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { saveBookmark } from '../lib/appwrite';

const VideoCard = ({ video: { title, thumbnail, video, $id, creater: { avatar, username } } }) => {
    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false)
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuOpenVideoId, setMenuOpenVideoId] = useState(null)
    const handlePressMenu = (id) => {
        setMenuOpenVideoId(id)
        setIsMenuOpen(true)
    }
    const handleCloseMenu = () => {
        setIsMenuOpen(false)
        setMenuOpenVideoId(null)
    }

    const handlePressSaveVideo = async () => {
        try {
            await saveBookmark(user.$id, $id)
            handleCloseMenu();
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <View className="flex-col items-center px-4 mb-14 relative">
            <View className="flex-row gap-3 items-start relative">

                {/* creater desc tops */}
                <View className="justify-center items-center flex-row flex-1 ">
                    <View className="w-[46px] h-[46px] rounded-lg border-secondary border justify-center items-center p-0.5">
                        <Image source={{ uri: avatar }}
                            className="w-full h-full rounded-md"
                            resizeMode='cover'
                        />
                    </View>
                    <View className="justify-center flex-1 ml-3 gap-y-1" >
                        <Text className="text-white text-sm  font-psemibold" numberOfLines={1}>{title}</Text>
                        <Text className="text-gray-100 text-xs  font-pregular" numberOfLines={1}>{username}</Text>
                    </View>
                </View>


                { // if it is bookmark page then menu icon not show otherwise show
                    !pathname.startsWith("/bookmark") &&
                    <TouchableOpacity className="pt-2" onPress={() => { handlePressMenu($id) }}>
                        <Image source={icons.menu}
                            className="w-5 h-5"
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                }

                {/* menu modal */}
                {menuOpenVideoId === $id && (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isMenuOpen}
                        onRequestClose={handleCloseMenu}
                    >
                        <TouchableWithoutFeedback onPress={handleCloseMenu}>
                            <View className="flex-1 justify-end px-2 pb-2 mb-[75px]">
                                <View className="bg-black-200 shadow-xl border rounded-t-xl  border-gray-700 p-4 h-50">
                                    <TouchableOpacity
                                        className="justify-center flex-row items-center gap-3"
                                        onPress={handlePressSaveVideo}
                                    >
                                        <Image
                                            source={icons.bookmark}
                                            className="w-5 h-5"
                                            resizeMode='cover'
                                        />
                                        <Text className="text-white font-psemibold">Save video</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}




            </View>
            {
                play ? (
                    <Video
                        source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }}
                        className="w-full h-60 bg-black-200 rounded-xl  mt-3 "
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls
                        shouldPlay
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlay(false)
                            }
                        }}

                    />
                ) : (
                    <TouchableOpacity
                        className="w-full h-60 rounded-xl bg-black-109  relative justify-center items-center mt-3"
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                    >
                        <Image
                            source={{ uri: thumbnail }}
                            className="w-full h-full rounded-xl"
                            resizeMode='cover'
                        />
                        <Image
                            source={icons.play}
                            className="ww-12 h-12 absolute "
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default VideoCard