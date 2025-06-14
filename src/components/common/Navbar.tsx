"use client"

import { useState } from 'react'
import { useRouter } from "next/navigation"
import { IoArrowBack, IoClose, IoSettingsOutline } from "react-icons/io5"
import ThemeSwitcher from "./ThemeSwitcher"
import Link from 'next/link'
import { signOut } from "firebase/auth";
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'

const Navbar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user] = useAuthState(auth)

    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);

    const appName = "Flashcards"

    return (
        <nav className="w-full bg-(--background) relative flex justify-center h-12 md:h-16 shadow-md dark:shadow-[0_6px_6px_rgba(255,255,255,0.1)] z-50">

            <ul className="flex w-[95%] max-w-5xl items-center flex-row justify-between">
                <li>
                    <button onClick={() => router.back()} className="flex justify-between items-center w-6 h-6 cursor-pointer">
                        <IoArrowBack className="scale-150 w-full" />
                    </button>
                </li>
                <li><Link className="text-(--green) text-3xl" href="/">{appName}</Link></li>
                <li>
                    <button onClick={openMenu} className="flex  justify-between items-center w-6 h-6 cursor-pointer">
                        <IoSettingsOutline className="scale-150 w-full" />
                    </button>
                </li>
            </ul>

            {/* Overlay background */}
            {isOpen && (
                <div
                    onClick={closeMenu}
                    className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-5"
                />
            )}

            {/* Slide-out menu from the right */}
            <div
                className={`flex top-0 right-0 w-2/3 max-w-[400px] h-full fixed z-10 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="w-full h-full bg-(--background) overflow-y-auto">
                    <ul className="flex flex-col justify-start items-start text-lg w-full px-4 pb-6 pt-6 md:px-8 md:pb-8 md:pt-6 h-full">
                        <button
                            onClick={closeMenu}
                            aria-label="close menu"
                            className="h-6 w-6 cursor-pointer"
                        >
                            <IoClose className="scale-150 w-full" />
                        </button>
                        <h2 className='mt-4 text-(--green) font-bold text-xl'>Profile Settings</h2>
                        <h3 className='mt-4'>Logged in as:</h3>
                        {user ? (
                            <li className="flex flex-col items-center gap-1 text-center">
                                <span className="font-bold">{user.displayName || user.email}</span>
                            </li>
                        ) : (
                            <li className="text-gray-500">Nepřihlášen</li>
                        )}
                        <h3 className='mt-4'>Theme:</h3>
                        <li><ThemeSwitcher /></li>
                        <li className='w-full mt-auto'>
                            <button
                                onClick={() => {
                                    signOut(auth);
                                    sessionStorage.removeItem("user");
                                }}
                                className="mt-2 md:mt-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold cursor-pointer py-4 w-full"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
