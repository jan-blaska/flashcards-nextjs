"use client";

import db from "@/utils/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebaseConfig";
import Button from "@/components/Button";


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
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] justify-center items-center">
            <div className="flex flex-col items-center w-9/10 max-w-[400px] bg-black/5 dark:bg-white/10 p-8 rounded-2xl">
                <h1 className="text-2xl md:text-3xl text-(--green) pb-8">Create new category</h1>
                <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
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
                    <Button color="blue" type="submit">Create Category</Button>
                </form>
            </div>
        </div>
    )
}
