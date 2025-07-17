import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import EditCategoryPage from "./EditCategoryPage";

export default function EditCategory() {
  return (
    <Suspense fallback={<Loading />}>
      <EditCategoryPage />
    </Suspense>
  );
}
