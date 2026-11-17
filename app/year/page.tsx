import { redirect } from "next/navigation";
import { availableYears } from "@/utils/yearStats";

// /year 直接帶到最新一年
export default function YearIndex() {
  redirect(`/year/${availableYears()[0] ?? new Date().getFullYear()}`);
}
