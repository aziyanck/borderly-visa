import { createContext, useContext, useState, useCallback } from 'react'

const ApplicationContext = createContext(null)

const STORAGE_KEY = 'borderly_applications'

const STATUS = {
    DRAFT: 'draft',
    PASSPORT_PENDING: 'passport_pending',
    QUESTIONS_PENDING: 'questions_pending',
    PAYMENT_PENDING: 'payment_pending',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    DOCUMENTS_PENDING: 'documents_pending',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
}

function getStoredApplications() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            localStorage.removeItem(STORAGE_KEY)
        }
    }
    return []
}

export function ApplicationProvider({ children }) {
    const [applications, setApplications] = useState(() => getStoredApplications())

    const saveToStorage = (apps) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
    }

    const createApplication = useCallback((country, visaType) => {
        const newApp = {
            id: `app_${Date.now()}`,
            country,
            visaType,
            status: STATUS.PASSPORT_PENDING,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            passport: null,
            answers: {},
            payment: null
        }
        setApplications(prev => {
            const updated = [newApp, ...prev]
            saveToStorage(updated)
            return updated
        })
        return newApp
    }, [])

    const updateApplication = useCallback((id, updates) => {
        setApplications(prev => {
            const updated = prev.map(app =>
                app.id === id
                    ? { ...app, ...updates, updatedAt: Date.now() }
                    : app
            )
            saveToStorage(updated)
            return updated
        })
    }, [])

    const getApplication = useCallback((id) => {
        return applications.find(app => app.id === id)
    }, [applications])

    const deleteApplication = useCallback((id) => {
        setApplications(prev => {
            const updated = prev.filter(app => app.id !== id)
            saveToStorage(updated)
            return updated
        })
    }, [])

    return (
        <ApplicationContext.Provider value={{
            applications,
            createApplication,
            updateApplication,
            getApplication,
            deleteApplication,
            STATUS
        }}>
            {children}
        </ApplicationContext.Provider>
    )
}

export function useApplications() {
    const context = useContext(ApplicationContext)
    if (!context) {
        throw new Error('useApplications must be used within an ApplicationProvider')
    }
    return context
}
