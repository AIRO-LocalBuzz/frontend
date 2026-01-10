import { NavLink, useLocation } from 'react-router-dom'
import homeIcon from '../../assets/icons/nav/icon-home.svg'
import homeIconActive from '../../assets/icons/nav/icon-home-active.svg'
import honeycombsIcon from '../../assets/icons/nav/icon-honeycombs.svg'
import honeycombsIconActive from '../../assets/icons/nav/icon-honeycombs-active.svg'
import honeyIcon from '../../assets/icons/nav/icon-honey.svg'
import honeyIconActive from '../../assets/icons/nav/icon-honey-active.svg'
import bumblebeeIcon from '../../assets/icons/nav/icon-bumblebee.svg'
import bumblebeeIconActive from '../../assets/icons/nav/icon-bumblebee-active.svg'
import './BottomNav.css'

export default function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className='bottom-nav'>
      <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/home' ? homeIconActive : homeIcon} alt="홈" className="nav-icon" />
        <span>홈</span>
      </NavLink>
      <NavLink to="/beehive" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/beehive' ? honeycombsIconActive : honeycombsIcon} alt="게시글" className="nav-icon" />
        <span>게시글</span>
      </NavLink>
      <NavLink to="/my-review" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/my-review' ? honeyIconActive : honeyIcon} alt="꿀모으기" className="nav-icon" />
        <span>꿀모으기</span>
      </NavLink>
      <NavLink to="/mypage" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/mypage' ? bumblebeeIconActive : bumblebeeIcon} alt="마이페이지" className="nav-icon" />
        <span>마이페이지</span>
      </NavLink>
    </nav>
  )
}
