import { eachDayOfInterval } from "date-fns";

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
  
  const res = await fetch(`${BACKEND_ENDPOINT}/guest`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
  });

  if (!res.ok) {
    throw new Error("Guest could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? null;
}
export async function createGuest(newGuest) {
  const res = await fetch(`${BACKEND_ENDPOINT}/pushGuests`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGuest)
  });

  if (!res.ok) {
    throw new Error("Guest could not be loaded");
  }

  const data = await res.json();
  return data?.result ?? null;
}
export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
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

export async function getSettings() {
  try {
    const res = await fetch(
      "http://hk-alb2-47b2d838154cd58f.elb.ap-south-1.amazonaws.com/settings"
    );
    const countries = await res.json();
    return countries?.result ?? {};
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getCountries() {
  try {
    const res = await fetch(
      "http://hk-alb2-47b2d838154cd58f.elb.ap-south-1.amazonaws.com/getCountries"
    );
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
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
