import './App.css';
import EventList from './components/EventList.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <Header/>
      <div className='pt-3 pb-5'>
      <EventList />
      </div>
      <Footer/>
    </div>
  );
}

export default App;
