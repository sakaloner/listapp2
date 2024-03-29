import styles from './index.module.css'
import Request from '@/utils/request'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { removeTokenCookie } from '@/utils/cookies'

const MyProfile = () => {
    const [profileInfo, setProfileInfo] = useState(null)
    const router= useRouter()
    useEffect(() => {
        Request('myProfile', 'GET', {}, true)
            .then((response) => {
                response.json().then((data) => {
                    console.log('profile data', data)
                    setProfileInfo(data)
                })
            }
        )
    }, [])
    const handleLogOut = () => {
        removeTokenCookie().then(() => {
            setTimeout(()=>router.push('/login'), 500)
        })
    }

    if (!profileInfo) {return <div></div>}
    const {user_id, user_email, num_followers, num_following, num_items} = profileInfo
    return (
        <div className={styles.container}>
            <h1>Profile: {user_email}</h1>
            <button onClick={handleLogOut}>Log out</button>
            <div className={styles.followInfo}>
                <p>Following: {num_following}</p>
                <p>Followers: {num_followers}</p>
            </div>
            <div>Items Saved: {num_items}</div>
        </div>
    )
}
export default MyProfile