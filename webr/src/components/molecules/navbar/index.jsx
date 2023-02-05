import styles from './index.module.css'
import NavButton from '../navButton'
import Link from 'next/link'
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
    const handleUserChange = () => {

    }
    
    return (
        <div className={styles.contNavBar}>
            <nav className={navBarState ? styles.navBar : styles.navBarClose}>
                <i className={'icon-lw' + " " + styles.logo}>L</i>
                <input onClick={handleUserChange} type='text'/>
                <ul style={{padding:'0'}}>
                    <NavButton name='Profile' link='/' icon='Prof' state={navBarState}/>
                    <NavButton name='Explore' link='/' icon='Expl' state={navBarState}/>
                    <NavButton name='Categories' link='categories/' icon='cats' state={navBarState}/>
                    <NavButton name='Main' link='/' icon='main' state={navBarState}/>
                </ul>                
            </nav>
            <i className={styles.menu} onClick={handleClickMenu}>M</i>
        </div>
            
    )
}
export default NavBar

