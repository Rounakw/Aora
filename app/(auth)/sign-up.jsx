import { View, Text, ScrollView, StatusBar, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton.jsx'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite.js'
import { useGlobalContext } from '../../context/GlobalProvider.js'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full  h-full px-4 py-10">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode='contain'
          />
          <Text className="text-2xl text-white my-5 font-psemibold">Register in to Aora</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles=""
            placeholder={"johnDoe@12"}
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4"
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
            title={"Sign Up"}
            containerStyle={"mt-10"}
            isLoading={isSubmitting}
            handlePress={handleSubmit}
          />

          <View className="justify-center pt-5 flex-row gap-1">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href={"/sign-in"} className='text-lg text-secondary font-psemibold'>Sign In</Link>
          </View>

        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light" />
    </SafeAreaView>
  )
}

export default SignUp