import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import Home from './pages/Home';
import Admin from './pages/Admin';
import Music from './pages/Music';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='app-wrap'>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/music" element={<Music />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;