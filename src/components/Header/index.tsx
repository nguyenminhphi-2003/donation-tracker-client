import HeaderPanel from '../HeaderPanel';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='flex fixed top-0 justify-between w-full h-13 shadow-md px-2 items-center z-100 bg-white rounded-b-sm'>
            <Link to='/' className='size-13'>
                <img src={logo} alt='logo' />
            </Link>
            <HeaderPanel />
        </header>
    );
}

export default Header;
