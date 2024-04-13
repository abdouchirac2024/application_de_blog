import{BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
import SigIn from './pages/SigIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'


export default function App() {
  return (
    <BrowserRouter >

    <Header />
    
    <Routes>
      
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/sigin-in' element={<SigIn />} />
      <Route path='/sigin-up' element={<SignUp />} />
      <Route element={<PrivateRoute />}></Route>
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/projects' element={<Projects  />} />
    </Routes>
    <Footer />
    </BrowserRouter>
  )
}
