import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import bgQn from '../assets/bg-qn.png';

const VisaQuestionnaire = () => {
    const { countryName } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState('forward');
    const [formData, setFormData] = useState({
        purpose: '',
        occupation: '',
        invitation: '',
        addressMatch: '',
        schengenHistory: '',
        maritalStatus: ''
    });

    const questions = [
        {
            id: 'purpose',
            question: "what's your travel purpose?",
            options: ['Family visit', 'Tourism', 'Business visit']
        },
        {
            id: 'occupation',
            question: "What do you do?",
            options: ['Employed', 'Self employed', 'Student', 'Unemployed']
        },
        {
            id: 'invitation',
            question: "Do you have an invitation?",
            options: ['Yes', 'My family or friends will provide it', 'Need help']
        },
        {
            id: 'addressMatch',
            question: "Is your residential address same as the passport ?",
            options: ['Yes', 'No']
        },
        {
            id: 'schengenHistory',
            question: "Have you ever visited a schengen country before?",
            options: ['Yes', 'No']
        },
        {
            id: 'maritalStatus',
            question: "Martial Status",
            options: ['Single', 'Married', 'Divorced', 'Widow']
        }
    ];

    const handleOptionClick = (value) => {
        const currentQuestion = questions[currentStep];
        setFormData(prev => ({ ...prev, [currentQuestion.id]: value }));

        if (currentStep < questions.length - 1) {
            setDirection('forward');
            setTimeout(() => setCurrentStep(prev => prev + 1), 200); // Small delay for visual feedback
        } else {
            // Finished
            console.log('Form Finished:', { ...formData, [currentQuestion.id]: value });
            alert("Questionnaire Completed! (This is a placeholder)");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection('backward');
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    const currentQ = questions[currentStep];

    return (
        <div
            className="min-h-screen bg-cover bg-center font-sans text-white relative flex flex-col"
            style={{ backgroundImage: `url(${bgQn})` }}
        >
            {/* Overlay for readability if needed, though design seems to rely on the image */}
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 flex flex-col h-full min-h-screen px-6 py-6 transition-all duration-300">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <button onClick={handleBack} className="p-2 -ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <Info className="h-5 w-5 opacity-70" />
                </div>

                {/* Progress Bar (Optional, inferred from top steps counts like 7, 8 in screenshot headers) */}
                {/* <div className="text-center text-xs opacity-60 mb-8">
            iPhone 13 & 14 - {7 + currentStep}
        </div> */}

                {/* Question Section */}
                <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full mb-20 space-y-8">

                    <h2 className="text-2xl text-center font-medium leading-relaxed drop-shadow-md">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-4 w-full">
                        {currentQ.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full py-4 px-6 rounded-2xl backdrop-blur-md border border-white/30 
                  bg-white/20 text-white font-medium text-lg hover:bg-white/30 active:scale-[0.98] 
                  transition-all shadow-lg text-center
                  ${formData[currentQ.id] === option ? 'bg-white/40 ring-2 ring-white/50' : ''}
                  `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default VisaQuestionnaire;
