import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  const { cabinId } = params;

  try {
    const [cabin, bookings] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);
    if(!cabin) throw new Error("Cabin Not Found...")
    return Response.json({
      cabin,
      bookings,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      message: "Cabin not found",
    });
  }
}
