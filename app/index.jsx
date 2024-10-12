import { Image, ScrollView, StatusBar, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../constants"
import { Link, Redirect, router } from "expo-router"
import CustomButton from '../components/CustomButton.jsx'
import { useGlobalContext } from '@/context/GlobalProvider'

const App = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();



  if (!isLoading && isLoggedIn) {
    return <Redirect href={"/home"} />
  }

  return (
    <SafeAreaView className=" bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[130px] px-4"
            resizeMode='contain'
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode='contain'
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">Discover Endless Posibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode='contain' />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovations: embark on a journey of limitless exploration with Aora</Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => { router.push("sign-in") }}
            containerStyle="w-full mt-7"
            textStyles={""}
            isLoading={false} />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light" />
    </SafeAreaView>
  )
}

export default App
