"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

export default function Filter({ filter }) {
  const searchparams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleFilter(filter) {
    // console.log(filter);
    const params = new URLSearchParams(searchparams);
    params.set("capacity", filter);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
    <Button
        filter={"all"}
        handleFilter={handleFilter}
        placeHolder={"All Cabins"}
        activeFilter={filter}
      />
      <Button
        filter={"small"}
        handleFilter={handleFilter}
        placeHolder={" 1 - 3 Guests"}
        activeFilter={filter}
      />
      <Button
        filter={"medium"}
        handleFilter={handleFilter}
        placeHolder={"8 - 12 Guests"}
        activeFilter={filter}
      />
      <Button
        filter={"large"}
        handleFilter={handleFilter}
        placeHolder={"8+ Guests"}
        activeFilter={filter}
      />
    </div>
  );
}
function Button({ filter, handleFilter, placeHolder, activeFilter }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter == filter ? "bg-primary-700" : ""
      }`}
    >
      {placeHolder}
    </button>
  );
}
