import { Suspense } from "react";
import CreateCardPage from "./CreateCardPage";

export default function CreateCard() {
  return (
    <Suspense fallback={<div>Načítání...</div>}>
      <CreateCardPage />
    </Suspense>
  );
}
