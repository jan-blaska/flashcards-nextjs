"use client";

import { auth } from "@/utils/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Image from 'next/image';

export default function LoginPage() {

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const userName = formData.get('user-name');
        const password = formData.get('password');

        try {
            await signInWithEmailAndPassword(userName as string, password as string);
            sessionStorage.setItem("user", "true");
            router.push("/");
        } catch (error) {
            console.error("Error logging in:", error);
        }
        event.currentTarget.reset();
    }

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            sessionStorage.setItem("user", "true");
            router.push("/");
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <div className="flex max-w-5xl w-[95%] mx-auto py-8 flex-col h-screen justify-center items-center">
            <h1 className="text-3xl md:text-4xl text-green-500">Flashcards</h1>
            <h1 className="text-xl md:text-2xl pb-8">Login</h1>
            <form className="flex text-md flex-col gap-4 w-full md:w-1/2" onSubmit={handleLogin}>
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
                <button type="submit" className="mt-4 py-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl cursor-pointer">Login</button>
                <button type="button" onClick={
                    () => {
                        router.push("/sign-up");
                    }
                } className="py-3 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl cursor-pointer">Create Account</button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-3 py-3 w-full bg-white hover:bg-gray-200 cursor-pointer text-gray-800 font-semibold rounded-xl"
                >
                    <Image
                        src="icons/google.svg"
                        alt="Google logo"
                        width={20}
                        height={20}
                    />
                    Sign in with Google
                </button>
            </form>
        </div>
    )
}
