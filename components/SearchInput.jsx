import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants"
import { router, usePathname } from 'expo-router'

const SearchImput = ({ placeholder, initialQuery }) => {

    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || "")

    return (
        <View className="w-full h-16 px-9 bg-black-109 border-2 border-black-200  rounded-2xl focus:border-secondary-200 items-center justify-between flex-row space-x-4">
            <TextInput
                className="text-white mt-0.5 font-pregular text-base flex-1"
                value={query}
                placeholder={placeholder}
                placeholderTextColor={"#CDCDE0"}
                onChangeText={e => setQuery(e)}
            />

            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    if (!query) {
                        return Alert.alert("Missing QUerry", "Please input something to search results across database");
                    }
                    if (pathname.startsWith('/search')) router.setParams({ query });
                    else router.push(`/search/${query}`);

                }}
            >
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>

    )
}

export default SearchImput