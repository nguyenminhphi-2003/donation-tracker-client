import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { useState } from 'react';

function HeaderPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl select-none ${isOpen ? 'bg-gray-200' : ''}`}
        >
            <FontAwesomeIcon icon={faBars} />

            <div
                className={`absolute flex flex-col top-12 right-0 w-48 overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-lg ${isOpen ? 'max-h-56 border border-gray-300' : 'max-h-0'}`}
            >
                <a href='' className='px-4 py-3 transition-transform duration-150 hover:translate-x-1'>
                    All Activities
                </a>
                <a href='' className='px-4 py-3 transition-transform duration-150 hover:translate-x-1'>
                    My Donations
                </a>
                <a href='' className='px-4 py-3 transition-transform duration-150 hover:translate-x-1'>
                    Logout
                </a>
            </div>
        </div>
    );
}

export default HeaderPanel;
