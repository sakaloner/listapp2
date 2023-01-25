import styles from './index.module.css'
import Link from 'next/link'
import { useRouter } from 'next/dist/client/router'

const NavButton = ({name, link,icon, state})=>{
    const router=useRouter()
    return (
        <li className={router.pathname==link ? styles.navButtonActive :  styles.navButtonGeneral}>
            <Link href={link} className={ state ? styles.textNavButtonGeneral :styles.textNavButton}>                
                    <i className={styles.iconNavButton}>{icon}</i>
                    <span className={state ? '' : styles.dissapear}>{name}</span>
            </Link>
        </li>
    )
}
export default NavButton