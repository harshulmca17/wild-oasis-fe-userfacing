import React from "react";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { useReservations } from "./ReservationProvider";
import { auth } from "../_lib/auth";
import LoginMessage from "./LoginMessage";

export default async function Reservations({ cabin }) {
  const session = await auth();
  const [bookings, settings] = await Promise.all([
    getBookedDatesByCabinId(cabin.id),
    getSettings(),
  ]);

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector bookings={bookings} settings={settings} cabin={cabin} />
      {!session ? (
        <LoginMessage />
      ) : (
        <>
          {" "}
          <ReservationForm cabin={cabin} user={session?.user} />
        </>
      )}
    </div>
  );
}
