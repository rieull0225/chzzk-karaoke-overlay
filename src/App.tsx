import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OverlayPage } from './pages/OverlayPage';
import { ControlPage } from './pages/ControlPage';
import { StreamIdInput } from './pages/StreamIdInput';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/overlay" element={<OverlayPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="/control/login" element={<StreamIdInput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
