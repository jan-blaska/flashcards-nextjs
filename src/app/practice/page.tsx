import { Suspense } from "react";
import PracticePage from "./PracticePage";
import Loading from "@/components/common/Loading";

export default function Practice() {
    return (
        <Suspense fallback={<Loading />}>
            <PracticePage />
        </Suspense>
    );
}
