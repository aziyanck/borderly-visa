import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, Shield, Plane, Globe, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button, Input } from '../components/ui'

function LoginPage() {
    const navigate = useNavigate()
    const { user, login } = useAuth()
    const [step, setStep] = useState('phone') // 'phone' | 'otp'
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const otpRefs = useRef([])

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [user, navigate])

    const handlePhoneSubmit = (e) => {
        e.preventDefault()
        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number')
            return
        }
        setError('')
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
            setStep('otp')
        }, 1000)
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault()
        const otpValue = otp.join('')
        if (otpValue.length !== 6) {
            setError('Please enter the 6-digit OTP')
            return
        }

        setError('')
        setIsLoading(true)

        setTimeout(() => {
            login({ phone, name: '' })
            navigate('/', { replace: true })
        }, 1000)
    }

    const features = [
        { icon: Globe, text: 'Visa for 190+ countries' },
        { icon: CheckCircle, text: 'Fast processing times' },
        { icon: Shield, text: 'Secure document handling' },
    ]

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Hero (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 flex-col justify-between p-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Borderly</h1>
                    <p className="text-cyan-100">Your visa, simplified</p>
                </div>

                <div className="max-w-md">
                    <h2 className="text-3xl xl:text-4xl font-bold text-white mb-6">
                        Apply for your visa in minutes, not hours
                    </h2>
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-white/90">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <span className="text-lg">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {['🇦🇪', '🇹🇭', '🇨🇳', '🇴🇲'].map((flag, i) => (
                            <div key={i} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg">
                                {flag}
                            </div>
                        ))}
                    </div>
                    <p className="text-white/80 text-sm">Trusted by 10,000+ travelers</p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden pt-12 pb-8 px-6 text-center bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-white">
                    <h1 className="text-3xl font-bold mb-2">Borderly</h1>
                    <p className="text-cyan-100 text-sm">Your visa, simplified</p>
                </div>

                {/* Form Card */}
                <div className="flex-1 bg-white rounded-t-3xl lg:rounded-none px-6 pt-8 pb-6 lg:flex lg:items-center lg:justify-center">
                    <div className="w-full max-w-sm mx-auto lg:max-w-md">
                        {step === 'phone' ? (
                            <>
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Welcome</h2>
                                <p className="text-slate-500 mb-8">Enter your phone number to get started</p>

                                <form onSubmit={handlePhoneSubmit}>
                                    <div className="flex gap-2 mb-4">
                                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl text-slate-600 font-medium">
                                            <span>🇮🇳</span>
                                            <span>+91</span>
                                        </div>
                                        <Input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="flex-1"
                                            maxLength={10}
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={isLoading}
                                        disabled={phone.length < 10}
                                    >
                                        Continue <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Verify OTP</h2>
                                <p className="text-slate-500 mb-8">
                                    Enter the 6-digit code sent to +91 {phone}
                                </p>

                                <form onSubmit={handleOtpSubmit}>
                                    <div className="flex gap-2 justify-center mb-6">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (otpRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 lg:w-14 lg:h-16 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                            />
                                        ))}
                                    </div>

                                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                                    <Button
                                        type="submit"
                                        fullWidth
                                        isLoading={isLoading}
                                    >
                                        Verify & Continue
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="w-full mt-4 text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Change phone number
                                    </button>
                                </form>
                            </>
                        )}

                        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
                            <Shield className="h-4 w-4" />
                            <span>Your data is secure and encrypted</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
