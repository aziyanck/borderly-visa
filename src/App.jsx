import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import VisaDetails from './pages/VisaDetails';
import VisaQuestionnaire from './pages/VisaQuestionnaire';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/visa/:countryName" element={<VisaDetails />} />
            <Route path="/visa/:countryName/questions" element={<VisaQuestionnaire />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
