export const countries = [
    {
        code: 'CN',
        name: 'China',
        flag: '🇨🇳',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa (L)',
                description: 'For tourism and sightseeing',
                processingTime: '5-7 business days',
                fee: 4500,
                validity: '30-90 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Passport-size photos',
            'Flight itinerary',
            'Hotel reservations',
            'Bank statements (last 3 months)'
        ]
    },
    {
        code: 'OM',
        name: 'Oman',
        flag: '🇴🇲',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa',
                description: 'For tourism and leisure',
                processingTime: '3-5 business days',
                fee: 2500,
                validity: '30 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Passport-size photos',
            'Confirmed return tickets',
            'Hotel booking confirmation',
            'Travel insurance'
        ]
    },
    {
        code: 'AE',
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa',
                description: '30-day tourist visa',
                processingTime: '2-3 business days',
                fee: 3500,
                validity: '30 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Passport-size photos',
            'Flight booking',
            'Hotel reservation',
            'Bank statement'
        ]
    },
    {
        code: 'TH',
        name: 'Thailand',
        flag: '🇹🇭',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa (TR)',
                description: 'Single entry tourist visa',
                processingTime: '3-5 business days',
                fee: 2000,
                validity: '60 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Passport-size photos',
            'Confirmed flight tickets',
            'Hotel booking',
            'Bank statement (last 3 months)',
            'Travel itinerary'
        ]
    },
    {
        code: 'SG',
        name: 'Singapore',
        flag: '🇸🇬',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa',
                description: 'Short-term visit pass',
                processingTime: '3-5 business days',
                fee: 2500,
                validity: '30 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Recent passport-size photos',
            'Return flight tickets',
            'Proof of accommodation',
            'Sufficient funds proof'
        ]
    },
    {
        code: 'JP',
        name: 'Japan',
        flag: '🇯🇵',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Tourist Visa',
                description: 'Single/Multiple entry tourist visa',
                processingTime: '5-7 business days',
                fee: 4000,
                validity: '15-90 days'
            }
        ],
        requirements: [
            'Valid passport (6+ months validity)',
            'Passport-size photos (4.5x4.5cm)',
            'Employment certificate',
            'ITR for last 3 years',
            'Bank statements (last 6 months)',
            'Detailed travel itinerary'
        ]
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        flag: '🇬🇧',
        visaTypes: [
            {
                id: 'tourist',
                name: 'Standard Visitor Visa',
                description: 'For tourism, business, or medical treatment',
                processingTime: '15-20 business days',
                fee: 8500,
                validity: '6 months'
            }
        ],
        requirements: [
            'Valid passport',
            'Financial documents',
            'Accommodation proof',
            'Travel history',
            'Employment proof',
            'Purpose of visit documentation'
        ]
    },
    {
        code: 'US',
        name: 'United States',
        flag: '🇺🇸',
        visaTypes: [
            {
                id: 'tourist',
                name: 'B1/B2 Visitor Visa',
                description: 'Business and tourism visa',
                processingTime: '30-60 business days',
                fee: 12500,
                validity: '10 years (multiple entry)'
            }
        ],
        requirements: [
            'Valid passport',
            'DS-160 form completion',
            'Interview appointment',
            'Financial documents',
            'Employment proof',
            'Strong ties to home country'
        ]
    }
]

export function getCountryByCode(code) {
    return countries.find(c => c.code === code)
}

export function searchCountries(query) {
    const q = query.toLowerCase().trim()
    if (!q) return countries
    return countries.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    )
}
