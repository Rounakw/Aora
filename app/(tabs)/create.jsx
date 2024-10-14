import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from "expo-router";
import FormField from '../../components/FormField'
import { Video, ResizeMode } from "expo-av"
import { icons } from '../../constants'
import CustomButton from "../../components/CustomButton"
import * as DocumentPicker from "expo-document-picker"
import { useGlobalContext } from "../../context/GlobalProvider"
import { createVideoPost } from "../../lib/appwrite"
import Loading from '../../components/Loading';

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false)

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif", "video/mov"]
    })
    if (!result.canceled) {
      if (selectType == "image") {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
      if (selectType == "video") {
        setForm({ ...form, video: result.assets[0] })
      }

    } else {
      Alert.alert("Document picked", JSON.stringify(result, null, 2))
    }

  }

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: ""
  })

  const submit = async () => {
    if (!form.title || !form.prompt || !form.thumbnail || !form.video) {
      return Alert.alert("Please provide all fields")
    }

    setUploading(true)
    try {
      await createVideoPost({
        ...form,
        userId: user.$id
      })
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");

    } catch (error) {
      Alert.alert("Error", error.message)

    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: ""
      })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 mt-3">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>

        {/* video title */}
        <FormField
          placeholder={"Give your video a catchy title..."}
          title={"Video Title"}
          value={form.title}
          handleChangeText={e => setForm({ ...form, title: e })}
          otherStyles={"mt-10"}
        />

        {/* video generating prompt */}
        <FormField
          placeholder={"The prompt you used to create this video"}
          title={"AI Prompt"}
          value={form.prompt}
          handleChangeText={e => setForm({ ...form, prompt: e })}
          otherStyles={"mt-7"}
        />

        {/* video upload */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { openPicker("video") }}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-109 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 rounded-xl justify-center items-center">
                  <Image source={icons.upload}
                    resizeMode='contain'
                    className="h-1/2 w-1/2" />
                </View>

              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Thumbnail image */}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity activeOpacity={0.6} onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-109 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image source={icons.upload}
                  resizeMode='contain'
                  className="h-5 w-5" />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>

              </View>
            )}
          </TouchableOpacity>


        </View>

        {/* ceate button */}
        <CustomButton
          title={"Submit & Publish"}
          handlePress={submit}
          containerStyle={"mt-7"}
          isLoading={uploading}
        />
        {
          uploading && <Loading onRequestClose={uploading} visible={uploading} />
        }


      </ScrollView>
    </SafeAreaView>
  )
}

export default Create