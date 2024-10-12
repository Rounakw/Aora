import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'

const zoomIn = {
    0: {
        scale: 0.9
    },
    1: {
        scale: 1.1
    }
}
const zoomOut = {
    0: {
        scale: 1.1
    },
    1: {
        scale: 0.9
    }
}

const TrendingItem = ({ activeItem, item }) => {
    const [trendingVideoPlay, setTrendingVideoPlay] = useState(false);
    return (
        <Animatable.View
            className="mr-4"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}>
            {trendingVideoPlay ? (
                <Video
                    source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
                    className="w-52 h-72 rounded-[35px] mt-3 bg-white/40"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay={true}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setTrendingVideoPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    className="relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => setTrendingVideoPlay(true)}>
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode='cover' />
                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode='contain' />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(null)

    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key)
        }
    }
    return (
        <FlatList

            data={posts.documents}
            keyExtractor={item => item.$id}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            horizontal
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 60
            }}
            contentOffset={{ x: 150 }}
            showsHorizontalScrollIndicator={false}
        />
    )
}

export default Trending