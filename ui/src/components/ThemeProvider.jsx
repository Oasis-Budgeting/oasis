import { createContext, useContext, useEffect, useState } from "react"

const initialState = {
    theme: "dark",
    setTheme: () => null,
}

const AVAILABLE_THEMES = ["light", "dark", "midnight", "amoled", "system"]

const resolveSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const ThemeProviderContext = createContext(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(
        () => {
            const storedTheme = localStorage.getItem(storageKey)
            return AVAILABLE_THEMES.includes(storedTheme) ? storedTheme : defaultTheme
        }
    )

    useEffect(() => {
        const root = window.document.documentElement
        const activeTheme = theme === "system" ? resolveSystemTheme() : theme
        const darkThemes = ["dark", "midnight", "amoled"]

        root.classList.remove("light", "dark", "midnight", "amoled")
        root.classList.add(activeTheme)

        if (darkThemes.includes(activeTheme)) {
            root.classList.add("dark")
        }

        root.setAttribute("data-theme", activeTheme)
    }, [theme])

    const value = {
        theme,
        setTheme: (nextTheme) => {
            const normalizedTheme = AVAILABLE_THEMES.includes(nextTheme) ? nextTheme : defaultTheme
            localStorage.setItem(storageKey, normalizedTheme)
            setTheme(normalizedTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
