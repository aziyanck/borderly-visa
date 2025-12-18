import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, Camera, Edit3, Check, Shield } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { Button, Input, Card } from '../components/ui'

function PassportEntryPage() {
    const navigate = useNavigate()
    const { applicationId } = useParams()
    const { getApplication, updateApplication } = useApplications()

    const app = getApplication(applicationId)

    const [mode, setMode] = useState('choice')
    const [formData, setFormData] = useState(app?.passport || {
        givenName: '',
        surname: '',
        passportNumber: '',
        dateOfBirth: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        placeOfIssue: '',
        nationality: 'Indian'
    })
    const [errors, setErrors] = useState({})

    if (!app) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Application not found</p>
            </div>
        )
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.givenName) newErrors.givenName = 'Required'
        if (!formData.surname) newErrors.surname = 'Required'
        if (!formData.passportNumber) newErrors.passportNumber = 'Required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required'
        if (!formData.dateOfExpiry) newErrors.dateOfExpiry = 'Required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        updateApplication(applicationId, {
            passport: {
                ...formData,
                fullName: `${formData.givenName} ${formData.surname}`
            },
            status: 'questions_pending'
        })

        navigate(`/wizard/${applicationId}`)
    }

    const handleScanUpload = () => {
        setFormData({
            givenName: 'RAHUL',
            surname: 'SHARMA',
            passportNumber: 'P1234567',
            dateOfBirth: '1990-05-15',
            dateOfIssue: '2020-01-10',
            dateOfExpiry: '2030-01-09',
            placeOfIssue: 'Mumbai',
            nationality: 'Indian'
        })
        setMode('review')
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
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Passport Details</h1>
                            <p className="text-sm text-slate-500">{app.country.flag} {app.country.name} - {app.visaType.name}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-12">
                    {/* Left Column - Info */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Why we need your passport</h2>
                            <p className="text-slate-600 mb-6">
                                Your passport details help us auto-fill your visa application, ensuring accuracy and saving you time.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                        <Check className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Auto-fill application</h3>
                                        <p className="text-sm text-slate-500">We'll use your passport data to pre-fill common fields</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Secure storage</h3>
                                        <p className="text-sm text-slate-500">Your data is encrypted and never shared</p>
                                    </div>
                                </div>
                            </div>

                            <Card className="p-6 mt-8 bg-amber-50 border-amber-200">
                                <h3 className="font-semibold text-amber-800 mb-2">Important</h3>
                                <p className="text-sm text-amber-700">
                                    Make sure your passport has at least 6 months validity from your travel date.
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="max-w-lg lg:max-w-none">
                        {mode === 'choice' && (
                            <div className="space-y-4">
                                <p className="text-slate-600 mb-6 lg:hidden">
                                    We need your passport details to auto-fill your visa application.
                                </p>

                                <Card
                                    hoverable
                                    onClick={handleScanUpload}
                                    className="p-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                                            <Camera className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 lg:text-lg">Scan Passport</h3>
                                            <p className="text-sm text-slate-500">Upload or take a photo</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card
                                    hoverable
                                    onClick={() => setMode('manual')}
                                    className="p-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                                            <Edit3 className="h-7 w-7 text-slate-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 lg:text-lg">Enter Manually</h3>
                                            <p className="text-sm text-slate-500">Fill in the details yourself</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {(mode === 'manual' || mode === 'review') && (
                            <div className="space-y-4">
                                {mode === 'review' && (
                                    <Card className="p-4 bg-green-50 border-green-200 mb-6">
                                        <div className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <p className="text-green-700 text-sm font-medium">
                                                Details extracted! Please review and confirm.
                                            </p>
                                        </div>
                                    </Card>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Given Name(s)"
                                        value={formData.givenName}
                                        onChange={(e) => handleChange('givenName', e.target.value)}
                                        error={errors.givenName}
                                        required
                                    />
                                    <Input
                                        label="Surname"
                                        value={formData.surname}
                                        onChange={(e) => handleChange('surname', e.target.value)}
                                        error={errors.surname}
                                        required
                                    />
                                </div>

                                <Input
                                    label="Passport Number"
                                    value={formData.passportNumber}
                                    onChange={(e) => handleChange('passportNumber', e.target.value.toUpperCase())}
                                    error={errors.passportNumber}
                                    required
                                />

                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                    error={errors.dateOfBirth}
                                    required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Date of Issue"
                                        type="date"
                                        value={formData.dateOfIssue}
                                        onChange={(e) => handleChange('dateOfIssue', e.target.value)}
                                    />
                                    <Input
                                        label="Date of Expiry"
                                        type="date"
                                        value={formData.dateOfExpiry}
                                        onChange={(e) => handleChange('dateOfExpiry', e.target.value)}
                                        error={errors.dateOfExpiry}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Place of Issue"
                                        value={formData.placeOfIssue}
                                        onChange={(e) => handleChange('placeOfIssue', e.target.value)}
                                    />
                                    <Input
                                        label="Nationality"
                                        value={formData.nationality}
                                        onChange={(e) => handleChange('nationality', e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button fullWidth onClick={handleSubmit}>
                                        Continue to Application
                                    </Button>
                                    {mode === 'manual' && (
                                        <Button fullWidth variant="ghost" onClick={() => setMode('choice')}>
                                            Go Back
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PassportEntryPage
