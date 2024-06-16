import { eachDayOfInterval } from "date-fns";
import { revalidatePath } from "next/cache";

/////////////
// GET
const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT;
export async function getCabin(id) {
  const res = await fetch(`${BACKEND_ENDPOINT}/cabin/${id}`);

  if (!res.ok) {
    throw new Error("Cabin could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? null;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getCabins() {
  const res = await fetch(`${BACKEND_ENDPOINT}/cabins`);

  if (!res.ok) {
    throw new Error("Cabins could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? [];
}

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const res = await fetch(`${BACKEND_ENDPOINT}/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Guest could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? null;
}
export async function createGuest(newGuest) {
  const res = await fetch(`${BACKEND_ENDPOINT}/pushGuests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newGuest),
  });

  if (!res.ok) {
    throw new Error("Guest could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? null;
}
export async function getBooking(id) {
  const res = await fetch(`${BACKEND_ENDPOINT}/booking/${id}`);
  if (!res.ok) {
    throw new Error("Booking could not be loaded");
  }
  const data = await res.json();
  return data?.result ?? null;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  const res = await fetch(`${BACKEND_ENDPOINT}/getBookingsByCabinId`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cabinId: parseInt(cabinId),
      page: parseInt(1),
      pageSize: parseInt(process.env.PAGINATION_PAGE_SIZE),
    }),
  });

  if (!res.ok) {
    throw new Error("Cabins could not be loaded");
  }

  const data = await res.json();

  return data?.result?.bookings ?? [];
}
export async function getBookedDatesByGuestId(guestId) {
  const res = await fetch(`${BACKEND_ENDPOINT}/getBookingsByGuestId`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guestId: parseInt(guestId),
      page: parseInt(1),
      pageSize: parseInt(process.env.PAGINATION_PAGE_SIZE),
    }),
  });

  if (!res.ok) {
    throw new Error("Cabins could not be loaded");
  }

  const data = await res.json();
  return data?.result?.bookings ?? [];
}

export async function getSettings() {
  try {
    const res = await fetch(`${BACKEND_ENDPOINT}/settings`);
    const countries = await res.json();
    return countries?.result ?? {};
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getCountries() {
  try {
    const res = await fetch(`${BACKEND_ENDPOINT}/getCountries`);
    const countries = await res.json();
    return countries?.result ?? [];
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  try {
    console.log({ id, ...updatedFields });
    const res = await fetch(`${BACKEND_ENDPOINT}/updateGuests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        ...updatedFields,
      }),
    });
    const response = await res.json();

    revalidatePath("/account/profile");
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function updateBooking(updatedFields) {
  try {
    const res = await fetch(`${BACKEND_ENDPOINT}/updateBookingDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });
    const response = await res.json();

    revalidatePath(`/account/reservations/edit/${updatedFields.id}`);
    revalidatePath("/account/reservations");
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// DELETE

export async function deleteBooking(id) {
  try {
    const res = await fetch(`${BACKEND_ENDPOINT}/deleteBooking/${id}`);

    const response = await res.json();

    revalidatePath("/account/reservations");
  } catch {
    throw new Error("Error while Deleting ");
  }
}
