import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from "../../constants"


const TabIcon = ({ color, icon, name, focused }) => {
    return (
        <View className="items-center justify-center gap-1">
            
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-5 h-5"
            />

            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs `} style={{ color: color }}>
                {name}
            </Text>

        </View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false, // hide the option title
                    tabBarActiveTintColor: "#FFA001", // main color of menu items yellow,
                    tabBarInactiveTintColor: "#CDCDE0", // color when menu inactive
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 84
                    }

                }}>

                <Tabs.Screen
                    name='home'
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name={"Home"}
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='bookmark'
                    options={{
                        title: "Bookmark",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.bookmark}
                                color={color}
                                name={"Bookmark"}
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='create'
                    options={{
                        title: "Create",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.plus}
                                color={color}
                                name={"Create"}
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name='profile'
                    options={{
                        title: "Profile",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name={"Profile"}
                                focused={focused}
                            />
                        )
                    }}
                />

            </Tabs>
        </>
    )
}

export default TabsLayout