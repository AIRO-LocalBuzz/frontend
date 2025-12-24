import {NavLink, useLocation} from 'react-router-dom'
import homeIcon from '../../assets/icons/nav/icon-home.svg'
import homeIconActive from '../../assets/icons/nav/icon-home-active.svg'
import postIcon from '../../assets/icons/nav/icon-post.svg'
import postIconActive from '../../assets/icons/nav/icon-post-active.svg'
import myPageIcon from '../../assets/icons/nav/icon-mypage.svg'
import myPageIconActive from '../../assets/icons/nav/icon-mypage-active.svg'
import './BottomNav.css'

export default function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className='bottom-nav'>
      <NavLink to="/home" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/home' ? homeIconActive : homeIcon} alt="홈" className="nav-icon"/>
        <span>홈</span>
      </NavLink>
      <NavLink to="/beehive" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/beehive' ? postIconActive : postIcon} alt="게시글" className="nav-icon"/>
        <span>게시글</span>
      </NavLink>
      <NavLink to="/my-review" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/my-review' ? myPageIconActive : myPageIcon} alt="꿀모으기" className="nav-icon"/>
        <span>꿀모으기</span>
      </NavLink>
      <NavLink to="/mypage" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={pathname === '/mypage' ? myPageIconActive : myPageIcon} alt="마이페이지" className="nav-icon"/>
        <span>마이페이지</span>
      </NavLink>
    </nav>
  )
}
