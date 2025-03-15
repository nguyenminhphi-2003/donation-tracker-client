import Footer from './components/Footer';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div>
            <Header />
            <div className='mt-13'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;
