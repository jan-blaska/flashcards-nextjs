import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import CategoryPage from "./CategoryPage";

export default function Category() {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryPage />
    </Suspense>
  );
}
