import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { ChatInterface } from './pages/ChatInterface';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
