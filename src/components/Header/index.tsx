import HeaderPanel from '../HeaderPanel';
import logo from '../../assets/logo.png';

function Header() {
    return (
        <header className='flex fixed justify-between w-full h-13 shadow-md px-2 items-center z-100 bg-white rounded-b-sm'>
            <a href='' className='size-13'>
                <img src={logo} alt='logo' />
            </a>
            <HeaderPanel />
        </header>
    );
}

export default Header;
