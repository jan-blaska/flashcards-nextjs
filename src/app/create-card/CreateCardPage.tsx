"use client";

import db from "@/utils/firestore";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { auth } from "@/utils/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import Button from "@/components/Button";

export default function CreateCardPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const [user] = useAuthState(auth);
    const [categoryName, setCategoryName] = useState<string>("Unknown category");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryName = async () => {

            if (!user || !categoryId) {
                console.error("User is not authenticated");
                return;
            }

            try {
                const categoryRef = doc(db, "users", user.uid, "categories", categoryId);
                const categorySnapshot = await getDoc(categoryRef);

                if (categorySnapshot.exists()) {
                    const data = categorySnapshot.data();
                    setCategoryName(data.name);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching card stacks:", error);
            }
        };

        fetchCategoryName();
    }, [user, categoryId]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user || !categoryId) {
            console.error("User is not authenticated");
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const frontSide = formData.get('front-side');
        const backSide = formData.get('back-side');

        try {
            await setDoc(doc(db, "users", user.uid, "categories", categoryId), {
                createdAt: serverTimestamp(),
            }, { merge: true });

            await addDoc(collection(db, "users", user.uid, "categories", categoryId, "cards"), {
                frontSide: frontSide,
                backSide: backSide,
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error creating flashcard:", error);

        }
        form.reset();
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] justify-center items-center">
            <h2 className="text-lg md:text-xl text-center">{categoryName}</h2>
            <h1 className="text-2xl md:text-3xl text-(--green) pb-8">Create new card</h1>
            <form className="flex flex-col gap-4 w-full md:w-1/2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="front-side">Front Side:</label>
                    <input
                        type="text"
                        id="front-side"
                        name="front-side"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="back-side">Back Side:</label>
                    <input
                        type="text"
                        id="back-side"
                        name="back-side"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <Button className="mt-2" color="blue" type="submit">Create Card</Button>
            </form>
        </div>
    )
}
