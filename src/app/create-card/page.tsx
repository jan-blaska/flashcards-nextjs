"use client";

import db from "@/utils/firestore";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

export default function CreateCardPage() {
    const searchParams = useSearchParams();
    const rawCategory = searchParams.get("category");
    const category = rawCategory ? decodeURIComponent(rawCategory) : "Neznámá kategorie";

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const frontSide = formData.get('front-side');
        const backSide = formData.get('back-side');

        const category = "Random německá slovíčka";

        try {
            await setDoc(doc(db, "Flashcards", category), {
                createdAt: serverTimestamp(),
            }, { merge: true });

            await addDoc(collection(db, "Flashcards", category, "cards"), {
                frontSide: frontSide,
                backSide: backSide,
            });

        } catch (error) {
            console.error("Error creating flashcard:", error);

        }
        event.target.reset();
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col h-screen justify-center items-center">
            <h2 className="text-lg md:text-xl text-center">{category}</h2>
            <h1 className="text-2xl md:text-3xl text-green-500 pb-8">Create a New Flashcard</h1>
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
                <button className="mt-8 py-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer" type="submit">Create Card</button>
            </form>
        </div>
    )
}
