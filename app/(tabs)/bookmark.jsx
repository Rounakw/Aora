import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '../../lib/useAppwrite';
import { getBookmarkedVideosByUser } from '../../lib/appwrite';
import EmptyState from '../../components/EmptyState';
import SearchImput from '../../components/SearchInput';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import Loading from '../../components/Loading';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, reFetch: refetchBookmarkedPosts, isLoading } = useAppwrite(() => getBookmarkedVideosByUser(user.$id))

  const [refreshing, setRefreshing] = useState(false)
  const onRfresh = async () => {
    setRefreshing(true)
    await refetchBookmarkedPosts();
    setRefreshing(false)
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
          <View className="my-6 px-4">
            <Text className="text-2xl font-psemibold text-white">Saved Videos</Text>
            <View className="mt-6 mb-8">
              <SearchImput placeholder={"Search your saved videos"} />
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

export default Bookmark