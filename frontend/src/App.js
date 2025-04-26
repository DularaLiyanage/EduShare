import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import PostList from './components/PostList.jsx';
import PostForm from './components/PostForm.jsx';
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import AllLearningPlan from "./Pages/LearningPlan/AllLearningPlan";
import AddLearningPlan from "./Pages/LearningPlan/AddLearningPlan";
import UpdateLearningPlan from "./Pages/LearningPlan/UpdateLearningPlan";
import MyLearningPlan from "./Pages/LearningPlan/MyLearningPlan";
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/allLearningPlan" element={<AllLearningPlan />} />
            <Route path="/addLearningPlan" element={<AddLearningPlan />} />
            <Route path="/updateLearningPlan/:id" element={<UpdateLearningPlan />} />
            <Route path="/myLearningPlan" element={<MyLearningPlan />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
