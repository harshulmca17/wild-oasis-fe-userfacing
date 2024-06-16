"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservation } from "../_lib/actions";

export default function ReservationList({ bookings }) {
  const [opBookings, opBookingsDelete] = useOptimistic(bookings, (curBookings,bookingId) => {
    return curBookings.filter((booking) => booking.id !== bookingId);
  });

  async function handleDelete(bookingId) {
    opBookingsDelete(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <div>
      <ul className="space-y-6">
        {bookings.map((booking) => (
          <ReservationCard
            booking={booking}
            onDelete={handleDelete}
            key={booking.id}
          />
        ))}
      </ul>
    </div>
  );
}
