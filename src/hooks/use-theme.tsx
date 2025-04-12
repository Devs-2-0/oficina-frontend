// hooks/useTheme.ts
import { useEffect, useState } from "react"

export type Theme = "light" | "dark" | "system"

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system")

  // Aplica o tema resolvido
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme

    root.classList.remove("light", "dark")
    root.classList.add(resolved)
  }

  // Atualiza estado e localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    const initialTheme = savedTheme || "system"
    setTheme(initialTheme)

    // Listener para mudanças no sistema (apenas se o tema for "system")
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const current = localStorage.getItem("theme") as Theme | null
      if (!current || current === "system") {
        applyTheme("system")
      }
    }
    media.addEventListener("change", handler)

    return () => media.removeEventListener("change", handler)
  }, [])

  return { theme, setTheme }
}
