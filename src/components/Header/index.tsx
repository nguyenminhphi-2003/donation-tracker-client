import HeaderPanel from '../HeaderPanel';
import logo from '../../assets/logo.png';

function Header() {
    return (
        <header className='flex justify-between w-full h-13 shadow-md px-2 mb-2 items-center fixed z-100'>
            <a href='' className='size-13'>
                <img src={logo} alt='logo' />
            </a>
            <HeaderPanel />
        </header>
    );
}

export default Header;
