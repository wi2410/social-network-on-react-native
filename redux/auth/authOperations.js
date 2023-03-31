import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
  } from "firebase/auth";

import { Alert } from "react-native";
import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;


export const authSignUpUser =  ({email, password, userName}) => async (dispatch) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
  
        await updateProfile(auth.currentUser, {
          displayName: userName,
        //   photoURL: userAvatar,
        });
  
        const { uid, displayName } = auth.currentUser;
  
        dispatch(
          updateUserProfile({
            userId: uid,
            login: displayName,
            email,
            // userAvatar: photoURL,
          })
        );
      } catch (error) {
        Alert.alert(error.message);
      }
};

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Error! Email or password doesn't match!")
    }
  };
export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const authStateChangeUser = () => async (dispatch) => {
   onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        const userUpdateProfile = {
          email: user.email,
          userAvatar: user.photoURL,
          userName: user.displayName,
          userId: user.uid,
        };

        dispatch(updateUserProfile(userUpdateProfile));
        dispatch(authStateChange({ stateChange: true }));
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  });
};