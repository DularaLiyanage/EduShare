import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PostList from './components/PostList.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<EventList />} /> {/* Default route for events */}
            <Route path="/posts" element={<PostList />} /> {/* Route for posts */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;