'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <div className='flex gap-2 items-center'>
            <span>Light</span>
            <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`cursor-pointer w-14 h-8 flex items-center rounded-full px-1 transition-colors duration-300
                ${isDark ? 'bg-green-600' : 'bg-gray-300'}
            `}
            >
                <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${isDark ? 'translate-x-6' : 'translate-x-0'}
                `}
                />
            </button>
            <span>Dark</span>

        </div>

    )
}

export default ThemeSwitcher