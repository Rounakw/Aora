import { View, Text, SafeAreaView, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from "../../constants"
import SearchImput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'

const Home = () => {

  const { data: posts, isLoading, reFetch: refetchAllPosts } = useAppwrite(getAllPosts)
  const { data: latestPosts, reFetch: refetchTrendingPosts } = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)
  const onRfresh = async () => {
    setRefreshing(true)
    await refetchAllPosts();
    await refetchTrendingPosts();
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts.documents}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            {/* welcome screen */}
            <View className="justify-between items-start flex-row mb-6">

              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">Rounak Basak</Text>
              </View>

              <View className="mt-1.5">
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain' />
              </View>
            </View>

            {/* search input for videos */}
            <SearchImput placeholder={"Search for a video topic"} />

            {/* latest videos sections */}
            <View className="w-full flex-1 pt-5 pb-8 ">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
              <Trending posts={latestPosts} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload videos" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRfresh} />}
      />
    </SafeAreaView>
  )
}

export default Home