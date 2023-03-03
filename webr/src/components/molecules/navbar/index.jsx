import styles from './index.module.css'
import NavButton from '../navButton'
import { useState, useEffect } from 'react'

const NavBar = ()=>{
    const [navBarState, setNavBarState]=useState(true)
    useEffect( () => {
        setNavBarState(localStorage.getItem('navBar')==='true')
    } , [])

    const handleClickMenu= () => {
        localStorage.setItem('navBar', JSON.stringify(!navBarState))
        setNavBarState(!navBarState)
    }
    
    return (
        <div className={styles.contNavBar}>
            <nav className={navBarState ? styles.navBar : styles.navBarClose}>
                <i className={'icon-university' + " " + styles.logo}></i>
                <ul style={{padding:'0'}}>
                    <NavButton name='Explore' link='/explore' icon='icon-explore' state={navBarState}/>
                    <NavButton name='archive' link='/archive' icon='icon-box' state={navBarState}/>
                    <NavButton name='Main' link='/' icon='icon-book-reference' state={navBarState}/>
                    <NavButton name='Profile' link='/myprofile' icon='icon-cog' state={navBarState}/>
                </ul>                
            </nav>
            <i className={styles.menu + " " + "icon-menu"} onClick={handleClickMenu} ></i>
        </div>
            
    )
}
export default NavBar

