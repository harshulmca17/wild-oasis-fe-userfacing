import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForms from "@/app/_components/UpdateProfileForms";
import { auth } from "@/app/_lib/auth";
import Image from "next/image";

export const metadata = {
  title: "Update Profile",
};
export default async function Page() {
  // CHANGE
  const session = await auth();

  const countryFlag = 'pt.jpeg'
  const nationality = "portugal";
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForms countryFlag={countryFlag} user={session?.user}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={nationality}
          
        />
      </UpdateProfileForms>
    </div>
  );
}
