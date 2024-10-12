import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants"

const SearchImput = ({ value, placeholder, handleChangeText, otherStyles, ...props }) => {
    return (
        <View className="w-full h-16 px-9 bg-black-109 border-2 border-black-200  rounded-2xl focus:border-secondary-200 items-center justify-between flex-row space-x-4">
            <TextInput
                className="text-white mt-0.5 font-pregular text-base flex-1"
                value={value}
                placeholder={placeholder}
                placeholderTextColor={"#7b7b8b"}
                onChangeText={handleChangeText}
            />

            <TouchableOpacity activeOpacity={0.5}>
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