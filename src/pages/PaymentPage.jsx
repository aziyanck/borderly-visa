import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, Check, X, FileText, Clock } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { Button, Card } from '../components/ui'

function PaymentPage() {
    const navigate = useNavigate()
    const { applicationId } = useParams()
    const { getApplication, updateApplication } = useApplications()

    const app = getApplication(applicationId)

    const [status, setStatus] = useState('pending')

    if (!app) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Application not found</p>
            </div>
        )
    }

    const fee = app.visaType.fee
    const gst = Math.round(fee * 0.18)
    const total = fee + gst

    const handlePayment = () => {
        setStatus('processing')

        setTimeout(() => {
            const success = Math.random() > 0.1

            if (success) {
                setStatus('success')
                updateApplication(applicationId, {
                    status: 'submitted',
                    payment: {
                        amount: total,
                        status: 'paid',
                        paidAt: Date.now(),
                        transactionId: `TXN${Date.now()}`
                    }
                })
            } else {
                setStatus('failed')
            }
        }, 2000)
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 lg:h-12 lg:w-12 text-green-500" />
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-green-100 mb-8 lg:text-lg">Your visa application has been submitted</p>
                <p className="text-white/80 text-sm lg:text-base mb-8">
                    Transaction ID: {app.payment?.transactionId}
                </p>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/', { replace: true })}
                >
                    Go to Dashboard
                </Button>
            </div>
        )
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mb-6">
                    <X className="h-10 w-10 lg:h-12 lg:w-12 text-red-500" />
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Payment Failed</h1>
                <p className="text-red-100 mb-8 lg:text-lg">Please try again or use a different payment method</p>
                <div className="space-y-3 w-full max-w-xs">
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setStatus('pending')}
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => navigate('/')}
                        className="text-white hover:bg-white/20"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={status === 'processing'}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Payment</h1>
                            <p className="text-sm text-slate-500">{app.country.flag} {app.country.name} Visa</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    {/* Left Column - Order Summary */}
                    <div>
                        <Card className="p-6 lg:p-8 mb-6">
                            <h2 className="font-semibold text-slate-800 mb-6 lg:text-xl">Order Summary</h2>

                            {/* Visa Details */}
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 mb-6">
                                <span className="text-4xl lg:text-5xl">{app.country.flag}</span>
                                <div>
                                    <h3 className="font-semibold text-slate-800 lg:text-lg">{app.country.name}</h3>
                                    <p className="text-slate-500">{app.visaType.name}</p>
                                </div>
                            </div>

                            <div className="space-y-3 lg:space-y-4">
                                <div className="flex justify-between text-slate-600">
                                    <span>Visa Service Fee</span>
                                    <span>₹{fee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>GST (18%)</span>
                                    <span>₹{gst.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-slate-800">
                                    <span>Total</span>
                                    <span className="text-xl lg:text-2xl">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Desktop Pay Button */}
                        <div className="hidden lg:block">
                            <Button
                                fullWidth
                                size="lg"
                                onClick={handlePayment}
                                isLoading={status === 'processing'}
                                disabled={status === 'processing'}
                            >
                                <CreditCard className="h-5 w-5" />
                                {status === 'processing' ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                            </Button>

                            <p className="text-center text-sm text-slate-400 mt-4">
                                By proceeding, you agree to our Terms of Service and Refund Policy
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-4 lg:space-y-6">
                        <Card className="p-4 lg:p-6 bg-blue-50 border-blue-100">
                            <div className="flex gap-3">
                                <Shield className="h-6 w-6 text-blue-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-blue-800 mb-1">Secure Payment</p>
                                    <p className="text-sm lg:text-base text-blue-600">
                                        Your payment is processed securely. Refund available within 24 hours if application is cancelled.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 lg:p-6">
                            <div className="flex gap-3">
                                <Clock className="h-6 w-6 text-cyan-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800 mb-1">Processing Time</p>
                                    <p className="text-sm lg:text-base text-slate-600">
                                        {app.visaType.processingTime} after document verification
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 lg:p-6">
                            <div className="flex gap-3">
                                <FileText className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800 mb-1">What Happens Next</p>
                                    <ul className="text-sm lg:text-base text-slate-600 space-y-2 mt-2">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            <span>We'll review your application</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            <span>You may be asked for additional documents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            <span>Track status in your dashboard</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Mobile Pay Button */}
                <div className="lg:hidden mt-6">
                    <Button
                        fullWidth
                        onClick={handlePayment}
                        isLoading={status === 'processing'}
                        disabled={status === 'processing'}
                    >
                        <CreditCard className="h-5 w-5" />
                        {status === 'processing' ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                    </Button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        By proceeding, you agree to our Terms of Service and Refund Policy
                    </p>
                </div>
            </main>
        </div>
    )
}

export default PaymentPage
