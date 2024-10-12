import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: '67076f12002388a8983c',
    databaseId: "6707706f00098fef1e09",
    userCollection: "6707708400046c06f584",
    videoCollection: "670770bd00305db138a5",
    storageId: '670774a30039b322f45d',
}




// init react-native sdk
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client); // This service handles user authentication and account-related operations (like registration and login).
const avatars = new Avatars(client) // This service generates avatar images based on user data, specifically their initials.
const databases = new Databases(client); // This service is used for CRUD (Create, Read, Update, Delete) operations on documents in your Appwrite database.
export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollection,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );


        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}
// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log(error);

        throw new Error("error in signIn fn", error);
    }
}


// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollection,
            [Query.equal("accountId", currentAccount.targets[0].userId)]
        );

        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

//  get all posts
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollection
        )

        return posts
    } catch (error) {
        throw new Error(error)
    }
}

//  get all latest posts
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollection,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts
    } catch (error) {
        throw new Error(error)
    }
}

