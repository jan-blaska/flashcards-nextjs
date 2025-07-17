import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import EditCardPage from "./EditCardPage";

export default function EditCard() {
  return (
    <Suspense fallback={<Loading />}>
      <EditCardPage />
    </Suspense>
  );
}
