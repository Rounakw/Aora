import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: '67076f12002388a8983c',
    databaseId: "6707706f00098fef1e09",
    userCollection: "6707708400046c06f584",
    videoCollection: "670770bd00305db138a5",
    storageId: '670774a30039b322f45d',
    bookmarkCollection: '670ceda8000d3b0b0642',
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
const storage = new Storage(client); // This initializes the Storage service, which manages file uploads and storage.

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
            config.videoCollection,
            [Query.orderDesc('$createdAt')]
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
            [Query.orderAsc('$createdAt'), Query.limit(7)]
        )

        return posts
    } catch (error) {
        throw new Error(error)
    }
}

//  search posts by query
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollection,
            [Query.search('title', query)]
        )
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

//  get login user posts
export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollection,
            [Query.equal('creater', userId), Query.orderDesc("$createdAt")]
        )
        return posts.documents

    } catch (error) {
        throw new Error(error)
    }
}

// log out user
export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session

    } catch (error) {
        console.log("logout error", error);

        throw new Error(error)
    }
}

// cerate video post
export const createVideoPost = async (form) => {
    try {
        // get url
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video")
        ])

        // store url in document
        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollection,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creater: form.userId
            }
        )

        return newPost;


    } catch (error) {
        throw new Error(error);
    }
}

// upload file
export const uploadFile = async (file, type) => {
    if (!file) return;
    const { mimeType, ...rest } = file
    const asset = { type: mimeType, ...rest }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;


    } catch (error) {
        throw new Error(error);
    }

}

// get file url
export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFilePreview(config.storageId, fileId)
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            )
            if (!fileUrl) throw Error;

            return fileUrl

        } else {
            throw new Error("Invalid file type !");
        }

    } catch (error) {
        throw new Error(error)
    }

}

export const getLoggedInUserBookmarks = async (userId) => {
    try {
        const bookmarks = await databases.listDocuments(
            config.databaseId,
            config.bookmarkCollection,
            [Query.equal('userId', userId)]
        );

        return bookmarks.documents;
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        throw new Error(error);
    }
};

export const getBookmarkedVideosByUser = async (userId) => {
    try {
        // Get bookmarks for the user
        const bookmarks = await getLoggedInUserBookmarks(userId);
        const videoIds = bookmarks.map(b => b.videoId); // Extract video IDs

        if (videoIds.length === 0) {
            return []; 
        }

        // Fetch videos using the video IDs and sort by createdAt
        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollection,
            [
                Query.equal('$id', videoIds),
                Query.orderAsc('$createdAt')
            ]
        );

        return videos.documents; 
    } catch (error) {
        console.error('Error fetching bookmarked videos:', error);
        throw new Error(error);
    }s
};

// saved video
export const saveBookmark = async (userId, videoId) => {
    try {
        const newBookmark = await databases.createDocument(
            config.databaseId,
            config.bookmarkCollection,
            ID.unique(),
            {
                userId: userId,
                videoId: videoId
            });

        return newBookmark;

    } catch (error) {
        console.error('Error saving bookmark:', error);
        throw new Error(error);
    }
};







