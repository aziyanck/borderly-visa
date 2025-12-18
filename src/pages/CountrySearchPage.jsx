import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Clock, ChevronRight, Globe, Sparkles } from 'lucide-react'
import { searchCountries, countries } from '../data/countries'
import { useApplications } from '../context/ApplicationContext'
import { Card } from '../components/ui'

function CountrySearchPage() {
    const navigate = useNavigate()
    const { createApplication } = useApplications()
    const [query, setQuery] = useState('')

    const filteredCountries = useMemo(() => {
        return searchCountries(query)
    }, [query])

    const handleSelectCountry = (country) => {
        const visaType = country.visaTypes[0]
        const app = createApplication(country, visaType)
        navigate(`/passport/${app.id}`)
    }

    const popularCountries = countries.slice(0, 4)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Select Country</h1>
                    </div>

                    {/* Search Input */}
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for a country..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 lg:py-4 bg-slate-100 border-2 border-transparent rounded-xl lg:rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all text-base lg:text-lg"
                            autoFocus
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {/* Popular Countries - Show when no search query */}
                {!query && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Popular Destinations</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {popularCountries.map((country) => (
                                <Card
                                    key={country.code}
                                    hoverable
                                    onClick={() => handleSelectCountry(country)}
                                    className="p-4 lg:p-6 text-center"
                                >
                                    <span className="text-4xl lg:text-5xl block mb-3">{country.flag}</span>
                                    <h3 className="font-semibold text-slate-800 mb-1">{country.name}</h3>
                                    <p className="text-sm text-slate-500">₹{country.visaTypes[0].fee.toLocaleString()}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Countries */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-cyan-500" />
                        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                            {query ? `Results for "${query}"` : 'All Countries'}
                        </h2>
                        <span className="text-sm text-slate-400">({filteredCountries.length})</span>
                    </div>

                    {filteredCountries.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-slate-500">No countries found for "{query}"</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                            {filteredCountries.map((country) => (
                                <Card
                                    key={country.code}
                                    hoverable
                                    onClick={() => handleSelectCountry(country)}
                                    className="p-4 lg:p-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl lg:text-4xl">{country.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-800 lg:text-lg">{country.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{country.visaTypes[0].processingTime}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="font-medium text-slate-700">₹{country.visaTypes[0].fee.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 hidden sm:block" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CountrySearchPage
