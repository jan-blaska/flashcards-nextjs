import { Suspense } from "react";
import PracticePage from "./PracticePage";

export default function Practice() {
    return (
        <Suspense fallback={<div>Načítání...</div>}>
            <PracticePage />
        </Suspense>
    );
}
