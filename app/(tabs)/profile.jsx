import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchImput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from "../../context/GlobalProvider"
import VideoCard from '../../components/VideoCard'
import { router, useLocalSearchParams } from 'expo-router'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import Loading from '../../components/Loading'

const Profile = () => {

    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, reFetch: refetchUserPosts, isLoading } = useAppwrite(() => getUserPosts(user.$id));

    const [refreshing, setRefreshing] = useState(false)
    const onRfresh = async () => {
        setRefreshing(true)
        await refetchUserPosts();
        setRefreshing(false)
    }

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/sign-in")
    }


    return (
        <SafeAreaView className="h-full bg-primary">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">

                        {/* logout button */}
                        <TouchableOpacity
                            className="w-full items-end mb-10"
                            onPress={logout}
                        >
                            <Image
                                source={icons.logout}
                                resizeMode='contain'
                                className="w-6 h-6"
                            />
                        </TouchableOpacity>

                        {/* profile image */}
                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-md"
                                resizeMode='cover'
                            />
                        </View>

                        {/* Usrname */}
                        <InfoBox
                            title={user?.username}
                            containerStyle="mt-5"
                            titleStyle="text-lg"

                        />

                        {/* extra info */}
                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts.length || 0}
                                subTitle="Posts"
                                containerStyle="mr-10"
                                titleStyle="text-xl"

                            />
                            <InfoBox
                                title="1.2k"
                                subTitle="Followers"
                                titleStyle="text-xl"

                            />

                        </View>



                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No Videos for this search query" />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRfresh} />}

            />
            {
                isLoading && <Loading onRequestClose={isLoading} visible={isLoading} />
            }
        </SafeAreaView>
    )
}

export default Profile