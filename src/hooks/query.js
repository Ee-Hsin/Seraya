import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import {
  getCollection,
  getFirestoreTimestamp,
  postDoc,
  uploadToStorage,
} from "../hooks/firestore"
import { useAuth } from "./AuthContext"

const useGetBlogPosts = () => {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => getCollection("blogPosts"),
  })
}

const useGetPortfolio = () => {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: () => getCollection("portfolio", ["value", "desc"]),
  })
}

const useGetLetters = () => {
  return useQuery({
    queryKey: ["letters"],
    queryFn: () => getCollection("letters", ["date", "desc"]),
  })
}

const usePostEmailList = () => {
  return useMutation({
    mutationFn: (email) =>
      postDoc("emailList", {
        subscribedAt: getFirestoreTimestamp(),
        email: email,
      }),
  })
}

const usePostLetters = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (letter) => {
      //Must call a function to upload letter to firestore, which returns the downloadURL

      // Will need to wait for the storage return...
      const downloadURL = await uploadToStorage(
        `letters/${letter.title}`,
        letter.file
      )

      // // We remove the file (don't upload that to fireStore)
      // delete letter.file
      // // So we are uploading Title and Date, the fileURL will be added from the backend!
      // return postDoc("letters", letter)

      delete letter.file
      return postDoc("letters", { ...letter, fileURL: downloadURL })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["letters"],
      })
    },
  })
}

const usePostPortfolio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (stock) => postDoc("portfolio", stock, stock.ticker),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["portfolio"],
      })
    },
  })
}

const useSignIn = () => {
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: ({ email, password }) => signIn(email, password),
  })
}

//Creates the user doc on creation
const useCreateUser = () => {
  const { createUser } = useAuth()

  return useMutation({
    mutationFn: ({ email, password }) => createUser(email, password),
    //Think about what info we want to keep on the user doc.
    onSuccess: (cred) =>
      postDoc(
        "users",
        {
          isAdmin: false, //Set isAdmin to false by default on creation, and they can be updated
          //via the firebase console afterward
          email: cred.user.email,
          emailVerified: cred.user.emailVerified,
        },
        cred.user.uid
      ),
  })
}
const useResetPassword = () => {
  const { resetPassword } = useAuth()

  return useMutation({
    mutationFn: (email) => resetPassword(email),
  })
}

export {
  useGetBlogPosts,
  useGetPortfolio,
  useGetLetters,
  usePostEmailList,
  usePostLetters,
  usePostPortfolio,
  useSignIn,
  useCreateUser,
  useResetPassword,
}
