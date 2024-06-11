"use server";

import { signIn, signOut } from "./auth";

export async function signInAction() {
  //   try {
  await signIn("google", {
    redirectTo: "/account",
  });
  //   } catch (error) {
  //     console.error(error);
  //   }
}

export async function signOutAction() {
  //   try {
  await signOut({
    redirectTo: "/",
  });
  //   } catch (error) {
  // console.error(error);
  //   }
}
