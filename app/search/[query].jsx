import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import SearchImput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import Loading from '../../components/Loading'

const Search = () => {
    const { query } = useLocalSearchParams();
    const { data: posts, reFetch: refetchSearchPosts, isLoading } = useAppwrite(() => searchPosts(query));


    useEffect(() => {
        refetchSearchPosts()
    }, [query])


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
                        <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
                        <Text className="text-2xl font-psemibold text-white">{query}</Text>
                        <View className="mt-6 mb-8">
                            <SearchImput placeholder={"Search for a video topic"} initialQuery={query} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No Videos for this search query" />
                )}

            />
            {
                isLoading && <Loading onRequestClose={isLoading} visible={isLoading} />
            }
        </SafeAreaView>
    )
}

export default Search