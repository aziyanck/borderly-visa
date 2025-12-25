import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, User, Minus, Plus } from 'lucide-react';
import { countriesData } from '../data/countries';

const VisaDetails = () => {
    const { countryName } = useParams();
    const navigate = useNavigate();

    // Find country data, fallback if not found
    const countryData = countriesData.find(c => c.country === countryName) || countriesData[0];

    const [fromCountry, setFromCountry] = useState('India');
    const [memberType, setMemberType] = useState('Solo'); // Solo, Duo, Group
    const [groupCount, setGroupCount] = useState(3);

    const handleIncrement = () => setGroupCount(prev => prev + 1);
    const handleDecrement = () => setGroupCount(prev => (prev > 3 ? prev - 1 : 3));

    return (
        <div className="min-h-screen bg-white pb-6 font-sans">
            {/* Header Image Section */}
            <div className="relative h-72">
                <img
                    src={countryData.image}
                    alt={countryData.country}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                <div className="absolute top-6 left-6">
                    <button onClick={() => navigate(-1)} className="text-white">
                        <ArrowLeft className="h-8 w-8" />
                    </button>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                    <h1 className="text-4xl font-bold">{countryData.country}</h1>
                    <span className="text-5xl">{countryData.flag}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white -mt-6 rounded-t-[30px] relative px-6 pt-8 pb-6 shadow-xl">
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button className="flex-1 py-2 bg-gray-100 rounded-lg text-blue-600 font-medium text-sm">Blog</button>
                    <button className="flex-1 py-2 bg-gray-100 rounded-lg text-blue-600 font-medium text-sm">Trip planner</button>
                </div>

                {/* Duration / Trip Details */}
                <div className="space-y-6 mb-8">
                    <h3 className="text-center font-medium text-lg">Duration</h3>

                    <div className="relative">
                        <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs text-gray-500">From</label>
                        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3">
                            <input
                                type="text"
                                value={fromCountry}
                                onChange={(e) => setFromCountry(e.target.value)}
                                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                                placeholder="Origin Country"

                            />
                            <Calendar className="text-gray-400 h-5 w-5" />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs text-gray-500">To</label>
                        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3">
                            <span className="flex-1 text-gray-700">{countryData.country}</span>
                            <Calendar className="text-gray-400 h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Number of People */}
                <div className="space-y-6 mb-8">
                    <h3 className="text-center font-medium text-lg">Number of people</h3>

                    {memberType === 'Group' ? (
                        <div className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div
                                className="flex flex-col items-center gap-1 cursor-pointer"
                                onClick={() => setMemberType('Solo')} // Click to go back to selection if needed, though usually there's a back/cancel. simple toggle here.
                            >
                                <div className="p-2 bg-blue-700 rounded-lg text-white">
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-xs text-gray-600 font-medium">Group</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleDecrement}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-blue-700 text-xl font-bold active:bg-gray-50"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <span className="bg-gray-100 px-6 py-2 rounded-lg text-lg font-medium min-w-[3rem] text-center">{groupCount}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-blue-700 text-xl font-bold active:bg-gray-50"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setMemberType('Solo')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${memberType === 'Solo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <div className={`p-2 rounded-full ${memberType === 'Solo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <User className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-medium">Solo</span>
                            </button>

                            <button
                                onClick={() => setMemberType('Duo')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${memberType === 'Duo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <div className={`p-2 rounded-full ${memberType === 'Duo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-medium">Duo</span>
                            </button>

                            <button
                                onClick={() => setMemberType('Group')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${memberType === 'Group' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            >
                                <div className={`p-2 rounded-full ${memberType === 'Group' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-medium">Group</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={() => navigate(`/visa/${countryName}/questions`)}
                    className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition-colors"
                >
                    Get your Visa
                </button>
            </div>
        </div>
    );
};

export default VisaDetails;
