import { Suspense } from "react";
import CreateCardPage from "./CreateCardPage";
import Loading from "@/components/common/Loading";

export default function CreateCard() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateCardPage />
    </Suspense>
  );
}
