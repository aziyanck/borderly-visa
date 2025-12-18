import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Clock, Search } from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { getCountryByCode } from '../data/countries'
import { Navbar, Footer } from '../components/layout'
import { Button, Card, Badge } from '../components/ui'

function DashboardPage() {
    const navigate = useNavigate()
    const { applications } = useApplications()

    const getNextStep = (app) => {
        switch (app.status) {
            case 'passport_pending':
                return `/passport/${app.id}`
            case 'questions_pending':
                return `/wizard/${app.id}`
            case 'payment_pending':
                return `/payment/${app.id}`
            default:
                return `/application/${app.id}`
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const stats = [
        { label: 'Total Applications', value: applications.length },
        { label: 'In Progress', value: applications.filter(a => !['completed', 'rejected'].includes(a.status)).length },
        { label: 'Completed', value: applications.filter(a => a.status === 'completed').length },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {/* Stats Cards - Desktop */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="p-6">
                            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg lg:text-xl font-semibold text-slate-800">Your Applications</h2>
                        <p className="text-sm text-slate-500">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Button onClick={() => navigate('/search')} className="w-full sm:w-auto">
                        <Plus className="h-5 w-5" />
                        Start New Application
                    </Button>
                </div>

                {/* Applications Grid */}
                {applications.length === 0 ? (
                    <Card className="p-8 lg:p-12 text-center">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 lg:h-10 lg:w-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg lg:text-xl font-semibold text-slate-700 mb-2">No applications yet</h3>
                        <p className="text-slate-500 text-sm lg:text-base mb-6 max-w-md mx-auto">
                            Start your visa journey by clicking the button above. We'll guide you through every step.
                        </p>
                        <Button onClick={() => navigate('/search')}>
                            <Search className="h-5 w-5" />
                            Search Countries
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {applications.map((app) => {
                            const country = getCountryByCode(app.country.code)
                            return (
                                <Card
                                    key={app.id}
                                    hoverable
                                    onClick={() => navigate(getNextStep(app))}
                                    className="p-4 lg:p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl lg:text-5xl">{country?.flag || app.country.flag}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-800 truncate lg:text-lg">
                                                    {country?.name || app.country.name}
                                                </h3>
                                                <Badge status={app.status} />
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2">
                                                {app.visaType?.name || 'Tourist Visa'}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                <span>Updated {formatDate(app.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

export default DashboardPage
