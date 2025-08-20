import React from 'react';
import './HomeNav.css';
import logoIcon from '../../assets/icons/common/icon-logo.svg';
import searchIcon from '../../assets/icons/nav/icon-search.svg';
import { Bell } from 'lucide-react';

export default function HomeNav() {
    return (
        <nav className='home_nav'>
            <img
                className='localbuzz_logo'
                src={logoIcon}
                alt='localbuzz_logo'
            />
            <div className='nav_container'>
                <div className='search'>
                    <img src={searchIcon} />
                </div>
                <button className="bell">
                    <Bell size={24} color="#333" />
                </button>
            </div>
        </nav>
    )
}
