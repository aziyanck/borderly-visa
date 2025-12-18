// Question categories and their fields per country
// This is a simplified schema - can be expanded for each country

const baseQuestions = {
    personal: [
        {
            id: 'full_name',
            label: 'Full Name (as in passport)',
            type: 'text',
            required: true,
            autoFill: 'passport.fullName'
        },
        {
            id: 'date_of_birth',
            label: 'Date of Birth',
            type: 'date',
            required: true,
            autoFill: 'passport.dateOfBirth'
        },
        {
            id: 'gender',
            label: 'Gender',
            type: 'select',
            options: ['Male', 'Female', 'Other'],
            required: true
        },
        {
            id: 'nationality',
            label: 'Nationality',
            type: 'text',
            required: true,
            defaultValue: 'Indian'
        },
        {
            id: 'marital_status',
            label: 'Marital Status',
            type: 'select',
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            required: true
        }
    ],
    contact: [
        {
            id: 'email',
            label: 'Email Address',
            type: 'email',
            required: true
        },
        {
            id: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: true
        },
        {
            id: 'address',
            label: 'Current Address',
            type: 'textarea',
            required: true
        },
        {
            id: 'city',
            label: 'City',
            type: 'text',
            required: true
        },
        {
            id: 'state',
            label: 'State',
            type: 'text',
            required: true
        },
        {
            id: 'pincode',
            label: 'PIN Code',
            type: 'text',
            required: true
        }
    ],
    employment: [
        {
            id: 'employment_status',
            label: 'Employment Status',
            type: 'select',
            options: ['Employed', 'Self-Employed', 'Student', 'Retired', 'Unemployed'],
            required: true
        },
        {
            id: 'employer_name',
            label: 'Employer/Company Name',
            type: 'text',
            required: true,
            showIf: { field: 'employment_status', value: ['Employed', 'Self-Employed'] }
        },
        {
            id: 'designation',
            label: 'Designation/Role',
            type: 'text',
            required: true,
            showIf: { field: 'employment_status', value: ['Employed', 'Self-Employed'] }
        },
        {
            id: 'employer_address',
            label: 'Employer Address',
            type: 'textarea',
            required: false,
            showIf: { field: 'employment_status', value: ['Employed'] }
        },
        {
            id: 'annual_income',
            label: 'Annual Income (INR)',
            type: 'number',
            required: true
        }
    ],
    travel: [
        {
            id: 'travel_date',
            label: 'Expected Travel Date',
            type: 'date',
            required: true
        },
        {
            id: 'return_date',
            label: 'Expected Return Date',
            type: 'date',
            required: true
        },
        {
            id: 'purpose',
            label: 'Purpose of Visit',
            type: 'select',
            options: ['Tourism', 'Business', 'Medical', 'Education', 'Other'],
            required: true
        },
        {
            id: 'accommodation_type',
            label: 'Type of Accommodation',
            type: 'select',
            options: ['Hotel', 'Hostel', 'Airbnb', 'Staying with Friends/Family', 'Other'],
            required: true
        },
        {
            id: 'accommodation_address',
            label: 'Accommodation Address/Name',
            type: 'textarea',
            required: true
        },
        {
            id: 'previous_visits',
            label: 'Have you visited this country before?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
        }
    ],
    family: [
        {
            id: 'father_name',
            label: "Father's Name",
            type: 'text',
            required: true
        },
        {
            id: 'mother_name',
            label: "Mother's Name",
            type: 'text',
            required: true
        },
        {
            id: 'emergency_contact_name',
            label: 'Emergency Contact Name',
            type: 'text',
            required: true
        },
        {
            id: 'emergency_contact_phone',
            label: 'Emergency Contact Phone',
            type: 'tel',
            required: true
        },
        {
            id: 'emergency_contact_relation',
            label: 'Relation with Emergency Contact',
            type: 'text',
            required: true
        }
    ]
}

const categoryLabels = {
    personal: 'Personal Information',
    contact: 'Contact Details',
    employment: 'Employment Information',
    travel: 'Travel Details',
    family: 'Family & Emergency Contact'
}

const categoryOrder = ['personal', 'contact', 'employment', 'travel', 'family']

export function getQuestionsForCountry() {
    // For now, all countries use base questions
    // Can be customized per country later
    return {
        categories: categoryOrder,
        categoryLabels,
        questions: baseQuestions
    }
}

export function getTotalQuestionCount(countryCode) {
    const { questions } = getQuestionsForCountry(countryCode)
    return Object.values(questions).flat().length
}
