"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import {
  createBookingApi,
  deleteBooking,
  getBookedDatesByGuestId,
  getBooking,
  updateBooking,
  updateGuest,
} from "./data-service";
import { redirect } from "next/dist/server/api-utils";

export async function createBooking(bookingData, formData) {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in....");

    const newBooking = {
      ...bookingData,
      guestId: session.user.guestId,
      numGuests: Number(formData.get("numGuests")),
      observations: formData.get("observations").slice(0, 1000),
      totalPrice: Number(bookingData.cabinPrice),
      extraPrice: 0,
      status: "unconfirmed",
      isPaid: false,
      hasBreakfast: false,
    };

    console.log(newBooking);
    createBookingApi(newBooking);
    revalidatePath(`/cabins/${bookingData.cabinId}`);
    redirect(200, "/cabins/thankyou");
    // const booking = await createBooking(guestId, {
    //   ...bookingData,
    //   userId: user.uid,
    // });
    // return booking;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function updateProfile(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in....");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  // Test the input against the regex pattern
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national id...");

  const updateData = {
    nationality,
    nationalID,
    countryFlag,
  };
  console.log(session);
  await updateGuest(session?.user?.guestId, updateData);
}
export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in....");

  const guestBookings = await getBookedDatesByGuestId(session?.user?.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You don't have permission to delete this booking...");
  await deleteBooking(bookingId);
}
export async function signInAction() {
  //   try {
  await signIn("google", {
    redirectTo: "/account",
  });
  //   } catch (error) {
  //     console.error(error);
  //   }
}
export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in....");

  const request = {
    id: parseInt(formData.get("bookingId")),
    numGuests: parseInt(formData.get("numGuests")),
    observations: formData.get("observations"),
  };
  console.log(request);
  await updateBooking(request);
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
