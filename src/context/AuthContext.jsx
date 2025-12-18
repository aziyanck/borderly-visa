import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'borderly_user'

function getStoredUser() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            localStorage.removeItem(STORAGE_KEY)
        }
    }
    return null
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser())
    const [isLoading] = useState(false)

    const login = useCallback((userData) => {
        const userWithTimestamp = { ...userData, loggedInAt: Date.now() }
        setUser(userWithTimestamp)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithTimestamp))
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    const updateProfile = useCallback((updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
