import { useState } from 'react';
import { Search, ChevronRight, User, FileText, Calendar, MessageCircle, Map } from 'lucide-react';
import { countriesData } from '../data/countries';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(3);
    const navigate = useNavigate();

    const filteredCountries = countriesData.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleCountries = filteredCountries.slice(0, visibleCount);

    const handleViewMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Header Section */}
            <div className="bg-blue-700 text-white p-6 rounded-b-[40px] relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Borderly</h1>
                </div>

                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-4xl font-script italic">Want a smooth</h2>
                    <h2 className="text-4xl font-script italic">visa experience</h2>
                    <h2 className="text-4xl font-script italic">It's Starts here</h2>

                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    </div>
                </div>

                <div className="relative mb-[-25px]">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-white" />
                    <input
                        type="text"
                        placeholder="Search for the country"
                        className="w-full bg-blue-800/80 border border-blue-400 placeholder-blue-200 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="px-5 pt-12 space-y-6">

                {/* Visa Cards */}
                <div className="space-y-4">
                    {visibleCountries.length > 0 ? (
                        visibleCountries.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                                onClick={() => navigate(`/visa/${card.country}`)}
                            >
                                <div className="h-32 w-full relative">
                                    <img src={card.image} alt={card.country} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-2 right-2 text-4xl shadow-sm">{card.flag}</div>
                                </div>
                                <div className="p-4 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{card.country}</h3>
                                        <p className="text-gray-500 text-sm">{card.type}</p>

                                        <div className="mt-2 flex items-center text-xs text-gray-400">
                                            <span className="mr-1">🕒</span> Processing time : {card.time}
                                        </div>
                                    </div>
                                    <div className="text-blue-600 font-bold text-lg">
                                        {card.price}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No countries found.
                        </div>
                    )}
                </div>

                {/* View More Button */}
                {visibleCount < filteredCountries.length && (
                    <button
                        onClick={handleViewMore}
                        className="w-full py-3 text-gray-600 border-t border-b border-dashed border-blue-300 hover:bg-gray-50 transition-colors"
                    >
                        View more
                    </button>
                )}

                {/* Extended Options */}
                <div className="space-y-2">
                    <h3 className="text-center text-lg font-medium text-gray-700 mb-4 border-t border-b border-dashed border-blue-300 py-2">Extended Options</h3>
                    {['Blog', 'Trip planing', 'Documents filling'].map((item) => (
                        <div key={item} className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-600">{item}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-center text-lg font-medium text-gray-700 border-t border-b border-dashed border-blue-300 py-2">FAQ ?</h3>
                    <button className="w-full py-3 border border-gray-200 rounded-lg text-gray-600 bg-gray-50">
                        Ask Your questions
                    </button>
                    {['Trip planing', 'Documents filling'].map((item) => (
                        <div key={item} className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-600">{item}</span>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center font-xs text-gray-500 text-[10px]">
                <div className="flex flex-col items-center text-blue-600">
                    <Search className="h-6 w-6 mb-1" />
                    <span>Search</span>
                </div>
                <div className="flex flex-col items-center">
                    <Map className="h-6 w-6 mb-1" />
                    <span>Itinerary</span>
                </div>
                <div className="flex flex-col items-center">
                    <FileText className="h-6 w-6 mb-1" />
                    <span>Documents</span>
                </div>
                <div className="flex flex-col items-center">
                    <MessageCircle className="h-6 w-6 mb-1" />
                    <span>FAQs</span>
                </div>
                <div className="flex flex-col items-center">
                    <User className="h-6 w-6 mb-1" />
                    <span>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
