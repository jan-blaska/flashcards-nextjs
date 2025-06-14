"use client";

import { auth } from "@/utils/firebaseConfig";
import { useRouter } from "next/navigation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function SignUpPage() {

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const router = useRouter();

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const userName = formData.get('user-name');
        const password = formData.get('password');

        try {
            await createUserWithEmailAndPassword(userName as string, password as string);
            router.push("/login");
        } catch (error) {
            console.error("Error signing up:", error);
        }
        event.currentTarget.reset();
    }

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col h-screen justify-center items-center">
            <h1 className="text-3xl md:text-4xl text-green-500">Flashcards</h1>
            <h1 className="text-xl md:text-2xl pb-8">Sign Up</h1>
            <form className="flex text-md flex-col gap-4 w-full md:w-1/2" onSubmit={handleSignUp}>
                <div className="flex flex-col">
                    <label htmlFor="user-name">User name:</label>
                    <input
                        type="text"
                        id="user-name"
                        name="user-name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button className="mt-4 py-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer" type="submit">Sign Up</button>
            </form>
        </div>
    )
}
