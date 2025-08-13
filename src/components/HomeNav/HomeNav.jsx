import React from 'react';
import './HomeNav.css';
import logoImg from '../../assets/images/common/img-localbuzz.png';
import searchIcon from '../../assets/icons/nav/icon-search.svg';
import pointIcon from '../../assets/icons/nav/icon-point.svg';

export default function Nav() {
    return (
        <nav className='main_nav'>
            <img
                className='localbuzz_logo'
                src={logoImg}
                alt='localbuzz_logo'
            />
            <div className='nav_container'>
                <div className='search'>
                    <img src={searchIcon} />
                </div>
                <div className='point'>
                    <img src={pointIcon} className='point_p' />
                    <p>1.2만</p>
                </div>
            </div>
        </nav>
    )
}
