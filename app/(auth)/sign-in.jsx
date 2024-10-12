import { View, Text, ScrollView, StatusBar, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton.jsx'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite.js'
import { useGlobalContext } from '../../context/GlobalProvider.js'

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [isSubmiting, setIsSubmiting] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext();

  async function handleSubmit() {
    if (!form.email || !form.password) {
      return Alert.alert("Error", "Please fill in all fields")
    }
    setIsSubmiting(true)

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();

      // set it to global state
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home")
    } catch (error) {
      console.log(error);
      return Alert.alert('Error', error)

    } finally {
      setIsSubmiting(false)
    }
    
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full  h-full px-4 py-10">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode='contain'
          />
          <Text className="text-2xl text-white my-5 font-psemibold">Log in to Aora</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles=""
            keyboardType="email-address"
            placeholder={"johndoe@gmail.com"}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4"
            placeholder={". . . . . . . . . . . ."}
          />

          <CustomButton
            title={"Sign in"}
            containerStyle={"mt-10"}
            isLoading={isSubmiting}
            handlePress={handleSubmit} />

          <View className="justify-center pt-5 flex-row gap-1">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href={"/sign-up"} className='text-lg text-secondary font-psemibold'>Sign Up</Link>

          </View>

        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light" />
    </SafeAreaView>
  )
}

export default SignIn