import { useNavigate } from 'react-router-dom'
import { Shield, Clock, Globe, CheckCircle, FileText, Users, ChevronRight, Phone, Mail, MapPin } from 'lucide-react'
import { countries } from '../data/countries'
import { useApplications } from '../context/ApplicationContext'
import { Navbar, Footer } from '../components/layout'
import { Button, Card } from '../components/ui'

function HomePage() {
    const navigate = useNavigate()
    const { createApplication } = useApplications()

    const handleApply = (country) => {
        const visaType = country.visaTypes[0]
        const app = createApplication(country, visaType)
        navigate(`/passport/${app.id}`)
    }

    const services = [
        {
            icon: FileText,
            title: 'Tourist Visa',
            description: 'Travel the world with hassle-free tourist visa processing for 190+ countries.'
        },
        {
            icon: Users,
            title: 'Business Visa',
            description: 'Expand your business globally with our streamlined business visa services.'
        },
        {
            icon: Globe,
            title: 'Work Visa',
            description: 'Pursue international career opportunities with our work visa assistance.'
        }
    ]

    const features = [
        {
            icon: Shield,
            title: 'Secure & Trusted',
            description: 'Your documents and data are protected with bank-level encryption.'
        },
        {
            icon: Clock,
            title: 'Fast Processing',
            description: 'Get your visa processed quickly with our efficient application system.'
        },
        {
            icon: CheckCircle,
            title: 'Expert Guidance',
            description: 'Our visa experts guide you through every step of the application.'
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
                    {/* Background Image */}
                    <img
                        src="/src/39330.jpg"
                        alt="Immigration Services"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>

                    <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Bringing Integrity & Transparency
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                            Built on trust, integrity, transparency, and a seamless client
                            experience, we provide the best visa consultancy service in India.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="#visa-selection"
                                className="bg-white text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Apply Now
                            </a>
                            <a
                                href="#about"
                                className="bg-transparent text-white font-semibold px-8 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-20 lg:py-28 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">About Us</span>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
                                Your Trusted Visa Partner
                            </h2>
                            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                                Borderly is a leading visa consultancy firm helping thousands of Indians travel abroad for tourism, business, and work opportunities.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="p-8 text-center">
                                    <div className="w-14 h-14 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon className="h-7 w-7 text-cyan-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visa Selection Section */}
                <section id="visa-selection" className="py-20 lg:py-28">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Select Your Destination</span>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">Find the Perfect Visa for You</h2>
                            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                                Browse through our most popular destinations and find the visa that best suits your travel plans.
                            </p>
                        </div>

                        {/* Country Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {countries.map((country) => (
                                <Card key={country.code} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                        <span className="text-6xl">{country.flag}</span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900">{country.name}</h3>
                                        <p className="mt-2 text-slate-600 text-sm h-12">
                                            {country.visaTypes[0].description}
                                        </p>
                                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                            <Clock className="h-4 w-4" />
                                            <span>{country.visaTypes[0].processingTime}</span>
                                        </div>
                                        <div className="mt-1 text-lg font-bold text-slate-900">
                                            ₹{country.visaTypes[0].fee.toLocaleString()}
                                        </div>
                                        <Button
                                            fullWidth
                                            className="mt-4"
                                            onClick={() => handleApply(country)}
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-20 lg:py-28 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Our Services</span>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">Comprehensive Visa Solutions</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                                        <service.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                                    <p className="text-slate-600">{service.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features / Why Choose Us */}
                <section id="features" className="py-20 lg:py-28">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                            <div>
                                <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Why Choose Us</span>
                                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
                                    Experience the Borderly Difference
                                </h2>
                                <p className="mt-4 text-slate-600">
                                    We're committed to making your visa application journey as smooth as possible. Our expert team handles everything so you can focus on planning your trip.
                                </p>

                                <div className="mt-8 space-y-6">
                                    {[
                                        '10,000+ successful applications',
                                        '98% approval rate',
                                        '24/7 customer support',
                                        'Transparent pricing with no hidden fees'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-slate-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 lg:mt-0">
                                <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                                    <h3 className="text-2xl font-bold mb-4">Start Your Journey Today</h3>
                                    <p className="text-slate-300 mb-6">
                                        Join thousands of satisfied travelers who trusted Borderly for their visa needs.
                                    </p>
                                    <a
                                        href="#visa-selection"
                                        className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        Get Started <ChevronRight className="h-4 w-4" />
                                    </a>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 lg:py-28 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">Contact Us</span>
                            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">Get in Touch</h2>
                            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                                Have questions? Our team is here to help you with your visa application.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                    <Phone className="h-6 w-6 text-cyan-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                                <a href="tel:+919048955437" className="text-slate-600 hover:text-cyan-600">
                                    +91 90489 55437
                                </a>
                            </Card>
                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                    <Mail className="h-6 w-6 text-cyan-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                                <a href="mailto:contact@borderlyvisa.in" className="text-slate-600 hover:text-cyan-600">
                                    contact@borderlyvisa.in
                                </a>
                            </Card>
                            <Card className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                    <MapPin className="h-6 w-6 text-cyan-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">Location</h3>
                                <p className="text-slate-600">Kerala, India</p>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default HomePage
