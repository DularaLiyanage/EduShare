// import './App.css';
// import EventList from './components/EventList.jsx';
// import Header from './components/Header.jsx';
// import Footer from './components/Footer.jsx';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <div className="App">
//       <Header />
//       <div className="main-content">
//         <EventList />
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default App;
import React from "react";
import { Route, Routes } from "react-router";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import AllLearningPlan from "./Pages/LearningPlan/AllLearningPlan";
import AddLearningPlan from "./Pages/LearningPlan/AddLearningPlan";
import UpdateLearningPlan from "./Pages/LearningPlan/UpdateLearningPlan";
import MyLearningPlan from "./Pages/LearningPlan/MyLearningPlan";


function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/allLearningPlan" element={<AllLearningPlan />} />
          <Route path="/addLearningPlan" element={<AddLearningPlan />} />
          <Route path="/updateLearningPlan/:id" element={<UpdateLearningPlan />} />
          <Route path="/myLearningPlan" element={<MyLearningPlan />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
