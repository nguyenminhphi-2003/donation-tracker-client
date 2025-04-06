import Footer from './components/Footer';
import Header from './components/Header';
import GeminiChat from './components/GeminiChat';
import { Outlet } from 'react-router-dom';

function App() {
    return (
        <div>
            <Header />
            <div className='mt-13'>
                <Outlet />
            </div>
            <Footer />
            <GeminiChat />
        </div>
    );
}

export default App;