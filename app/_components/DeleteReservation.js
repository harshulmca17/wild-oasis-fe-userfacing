"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

import { useTransition } from "react";
import Spinner from "./Spinner";

function DeleteReservation({ bookingId, onDelete }) {
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete Resevation? "))
      startTransition(() => onDelete(bookingId));
  };
  return (
    <button
      onClick={handleDelete}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
      {isPending ? (
        <span className="mx-auto">
          <Spinner />
        </span>
      ) : (
        <span className="mt-1">Delete</span>
      )}
    </button>
  );
}

export default DeleteReservation;
