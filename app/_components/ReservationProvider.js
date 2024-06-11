"use client";

import { auth } from "../_lib/auth";

const { useContext, createContext, useState } = require("react");

const ReservationContext = createContext();
const initialState = { from: null, to: null };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
 
  const resetRange = () => setRange(initialState);
  return (
    <ReservationContext.Provider
      value={{ range, setRange, resetRange }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");

  return context;
}

export { ReservationProvider, useReservations };
