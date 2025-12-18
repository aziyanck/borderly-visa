import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Clock, FileText, CreditCard, Send } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { Button, Card, Badge } from '../components/ui'

const statusSteps = [
    { key: 'passport_pending', label: 'Passport Details', icon: FileText },
    { key: 'questions_pending', label: 'Application Form', icon: FileText },
    { key: 'payment_pending', label: 'Payment', icon: CreditCard },
    { key: 'submitted', label: 'Submitted', icon: Send },
    { key: 'under_review', label: 'Under Review', icon: Clock },
    { key: 'completed', label: 'Visa Approved', icon: Check }
]

function ApplicationDetailPage() {
    const navigate = useNavigate()
    const { applicationId } = useParams()
    const { getApplication } = useApplications()

    const app = getApplication(applicationId)

    if (!app) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Application not found</p>
            </div>
        )
    }

    const getCurrentStepIndex = () => {
        return statusSteps.findIndex(s => s.key === app.status)
    }

    const getActionButton = () => {
        switch (app.status) {
            case 'passport_pending':
                return (
                    <Button fullWidth onClick={() => navigate(`/passport/${app.id}`)}>
                        Continue - Add Passport
                    </Button>
                )
            case 'questions_pending':
                return (
                    <Button fullWidth onClick={() => navigate(`/wizard/${app.id}`)}>
                        Continue - Fill Application
                    </Button>
                )
            case 'payment_pending':
                return (
                    <Button fullWidth onClick={() => navigate(`/payment/${app.id}`)}>
                        Continue - Make Payment
                    </Button>
                )
            default:
                return null
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const currentStepIndex = getCurrentStepIndex()

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Application Details</h1>
                            <p className="text-sm text-slate-500">ID: {app.id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Country & Status Card */}
                        <Card className="p-6 lg:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <span className="text-5xl lg:text-6xl">{app.country.flag}</span>
                                <div className="flex-1">
                                    <h2 className="text-xl lg:text-2xl font-bold text-slate-800">{app.country.name}</h2>
                                    <p className="text-slate-500 lg:text-lg">{app.visaType.name}</p>
                                </div>
                                <Badge status={app.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 lg:gap-6 text-sm lg:text-base">
                                <div>
                                    <p className="text-slate-500">Created</p>
                                    <p className="font-medium text-slate-700">{formatDate(app.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Last Updated</p>
                                    <p className="font-medium text-slate-700">{formatDate(app.updatedAt)}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Progress Timeline */}
                        <Card className="p-6 lg:p-8">
                            <h3 className="font-semibold text-slate-800 mb-6 lg:text-xl">Progress</h3>
                            <div className="space-y-4 lg:space-y-6">
                                {statusSteps.map((step, index) => {
                                    const isCompleted = index < currentStepIndex
                                    const isCurrent = index === currentStepIndex
                                    const isPending = index > currentStepIndex

                                    const Icon = step.icon

                                    return (
                                        <div key={step.key} className="flex items-center gap-4">
                                            <div className={`
                        w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isCurrent ? 'bg-cyan-500 text-white' : ''}
                        ${isPending ? 'bg-slate-100 text-slate-400' : ''}
                      `}>
                                                {isCompleted ? (
                                                    <Check className="h-5 w-5 lg:h-6 lg:w-6" />
                                                ) : (
                                                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-medium lg:text-lg ${isPending ? 'text-slate-400' : 'text-slate-700'}`}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-sm text-cyan-600">In progress</p>
                                                )}
                                                {isCompleted && (
                                                    <p className="text-sm text-green-600">Completed</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>

                        {/* Action Button - Mobile */}
                        <div className="lg:hidden">
                            {getActionButton()}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6 mt-6 lg:mt-0">
                        {/* Action Button - Desktop */}
                        <div className="hidden lg:block">
                            {getActionButton()}
                        </div>

                        {/* Passport Info */}
                        {app.passport && (
                            <Card className="p-6">
                                <h3 className="font-semibold text-slate-800 mb-4">Passport Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Name</p>
                                        <p className="font-medium text-slate-700">{app.passport.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Passport No.</p>
                                        <p className="font-medium text-slate-700">{app.passport.passportNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Date of Birth</p>
                                        <p className="font-medium text-slate-700">{app.passport.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Expiry</p>
                                        <p className="font-medium text-slate-700">{app.passport.dateOfExpiry}</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Payment Info */}
                        {app.payment && (
                            <Card className="p-6">
                                <h3 className="font-semibold text-slate-800 mb-4">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Amount Paid</p>
                                        <p className="font-medium text-slate-700">₹{app.payment.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Transaction ID</p>
                                        <p className="font-medium text-slate-700 break-all">{app.payment.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Status</p>
                                        <p className="font-medium text-green-600 capitalize">{app.payment.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Paid On</p>
                                        <p className="font-medium text-slate-700">{formatDate(app.payment.paidAt)}</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Visa Info */}
                        <Card className="p-6 bg-slate-50">
                            <h3 className="font-semibold text-slate-800 mb-4">Visa Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Validity</span>
                                    <span className="font-medium text-slate-700">{app.visaType.validity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Processing Time</span>
                                    <span className="font-medium text-slate-700">{app.visaType.processingTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Fee</span>
                                    <span className="font-medium text-slate-700">₹{app.visaType.fee.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ApplicationDetailPage
