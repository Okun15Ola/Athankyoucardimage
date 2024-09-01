import './index.css';
import './App.css'
import ImagePage from './imagepage/imagepage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ImageDetailPage from './ImageDetailPage/ImageDetailPage';

function App() {
  return (
    <div className="App bg-[#000] h-full">
      <Router>
          <Routes>
              <Route path="/" element={<ImagePage />} />
              <Route path="/image/:id" element={<ImageDetailPage />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
