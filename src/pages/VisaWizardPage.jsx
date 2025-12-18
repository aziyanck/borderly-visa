import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { getQuestionsForCountry } from '../data/questions'
import { Button, Input, ProgressBar, Card } from '../components/ui'

function VisaWizardPage() {
    const navigate = useNavigate()
    const { applicationId } = useParams()
    const { getApplication, updateApplication } = useApplications()

    const app = getApplication(applicationId)
    const questions = useMemo(() => app ? getQuestionsForCountry(app.country.code) : null, [app])

    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
    const [errors, setErrors] = useState({})

    const initialAnswers = useMemo(() => {
        if (app?.answers && Object.keys(app.answers).length > 0) {
            return app.answers
        }
        if (app?.passport) {
            return {
                full_name: app.passport.fullName || '',
                date_of_birth: app.passport.dateOfBirth || '',
                nationality: app.passport.nationality || 'Indian'
            }
        }
        return {}
    }, [app])

    const [answers, setAnswers] = useState(initialAnswers)

    const saveTimeoutRef = useRef(null)

    const saveAnswers = useCallback((newAnswers) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }
        saveTimeoutRef.current = setTimeout(() => {
            updateApplication(applicationId, { answers: newAnswers })
        }, 500)
    }, [applicationId, updateApplication])

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [])

    if (!app || !questions) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Application not found</p>
            </div>
        )
    }

    const currentCategory = questions.categories[currentCategoryIndex]
    const currentQuestions = questions.questions[currentCategory]
    const categoryLabel = questions.categoryLabels[currentCategory]
    const isLastCategory = currentCategoryIndex === questions.categories.length - 1

    const shouldShowQuestion = (question) => {
        if (!question.showIf) return true
        const fieldValue = answers[question.showIf.field]
        return question.showIf.value.includes(fieldValue)
    }

    const handleChange = (questionId, value) => {
        const newAnswers = { ...answers, [questionId]: value }
        setAnswers(newAnswers)
        saveAnswers(newAnswers)
        if (errors[questionId]) {
            setErrors(prev => ({ ...prev, [questionId]: null }))
        }
    }

    const validateCategory = () => {
        const newErrors = {}
        currentQuestions.forEach(q => {
            if (q.required && shouldShowQuestion(q) && !answers[q.id]) {
                newErrors[q.id] = 'Required'
            }
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (!validateCategory()) return

        if (isLastCategory) {
            updateApplication(applicationId, {
                answers,
                status: 'payment_pending'
            })
            navigate(`/payment/${applicationId}`)
        } else {
            setCurrentCategoryIndex(prev => prev + 1)
            window.scrollTo(0, 0)
        }
    }

    const handleBack = () => {
        if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(prev => prev - 1)
            window.scrollTo(0, 0)
        } else {
            navigate(-1)
        }
    }

    const answeredCount = Object.keys(answers).filter(k => answers[k]).length
    const totalQuestions = Object.values(questions.questions).flat().length

    return (
        <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Visa Application</h1>
                            <p className="text-sm text-slate-500">{app.country.flag} {app.country.name}</p>
                        </div>
                    </div>
                    <ProgressBar current={answeredCount} total={totalQuestions} />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Sidebar - Steps (Desktop) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-32">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Sections</h3>
                            <div className="space-y-2">
                                {questions.categories.map((cat, index) => {
                                    const isComplete = index < currentCategoryIndex
                                    const isCurrent = index === currentCategoryIndex
                                    return (
                                        <div
                                            key={cat}
                                            className={`flex items-center gap-3 p-3 rounded-lg ${isCurrent ? 'bg-cyan-50 border border-cyan-200' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                        ${isComplete ? 'bg-green-500 text-white' : ''}
                        ${isCurrent ? 'bg-cyan-500 text-white' : ''}
                        ${!isComplete && !isCurrent ? 'bg-slate-100 text-slate-400' : ''}
                      `}>
                                                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                                            </div>
                                            <span className={`text-sm ${isCurrent ? 'text-cyan-700 font-medium' : 'text-slate-600'}`}>
                                                {questions.categoryLabels[cat]}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Category Header */}
                        <Card className="p-4 lg:p-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                    {currentCategoryIndex + 1}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-800 lg:text-xl">{categoryLabel}</h2>
                                    <p className="text-sm text-slate-500">
                                        Step {currentCategoryIndex + 1} of {questions.categories.length}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Questions */}
                        <div className="space-y-4 lg:space-y-6">
                            {currentQuestions.filter(shouldShowQuestion).map((question) => (
                                <div key={question.id}>
                                    {question.type === 'select' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                {question.label}
                                                {question.required && <span className="text-red-500 ml-0.5">*</span>}
                                            </label>
                                            <select
                                                value={answers[question.id] || ''}
                                                onChange={(e) => handleChange(question.id, e.target.value)}
                                                className={`w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all ${errors[question.id] ? 'border-red-400' : ''}`}
                                            >
                                                <option value="">Select...</option>
                                                {question.options.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            {errors[question.id] && (
                                                <p className="mt-1.5 text-sm text-red-500">{errors[question.id]}</p>
                                            )}
                                        </div>
                                    ) : question.type === 'textarea' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                {question.label}
                                                {question.required && <span className="text-red-500 ml-0.5">*</span>}
                                            </label>
                                            <textarea
                                                value={answers[question.id] || ''}
                                                onChange={(e) => handleChange(question.id, e.target.value)}
                                                rows={3}
                                                className={`w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none ${errors[question.id] ? 'border-red-400' : ''}`}
                                            />
                                            {errors[question.id] && (
                                                <p className="mt-1.5 text-sm text-red-500">{errors[question.id]}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <Input
                                            label={question.label}
                                            type={question.type}
                                            value={answers[question.id] || question.defaultValue || ''}
                                            onChange={(e) => handleChange(question.id, e.target.value)}
                                            error={errors[question.id]}
                                            required={question.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Button */}
                        <div className="hidden lg:block mt-8">
                            <Button size="lg" onClick={handleNext}>
                                {isLastCategory ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Review & Pay
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Button (Mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
                <div className="max-w-lg mx-auto">
                    <Button fullWidth onClick={handleNext}>
                        {isLastCategory ? (
                            <>
                                <Check className="h-4 w-4" />
                                Review & Pay
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default VisaWizardPage
