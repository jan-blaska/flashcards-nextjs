"use client";

import db from "@/utils/firestore";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";


export default function CreateCategoryPage() {

    const [user] = useAuthState(auth);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            console.error("User is not authenticated");
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const newCategoryName = formData.get('new-category-name');

        try {
            await addDoc(collection(db, "users", user.uid, "categories"), {
                name: newCategoryName,
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error creating new category:", error);

        }
        form.reset();
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col h-screen justify-center items-center">
            <h1 className="text-2xl md:text-3xl text-green-500 pb-8">Create a New Category</h1>
            <form className="flex flex-col gap-4 w-full md:w-1/2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="new-category-name">Name:</label>
                    <input
                        type="text"
                        id="new-category-name"
                        name="new-category-name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button className="mt-8 py-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer" type="submit">Create Category</button>
            </form>
        </div>
    )
}
