import styles from './index.module.css'
import Request from '@/utils/request'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Profile = ({id}) => {
    const [profileInfo, setProfileInfo] = useState(null)
    const [rerender, setRerender] = useState(0)
    const router= useRouter()

    const handleConnection = (type) => {
        const body = {
            folower: user_id,
            folowee: parseInt(id)
        }
        // convert body to url parameters
        const urlParams = new URLSearchParams(body)
        Request(`${type}_user?${urlParams}`,  'POST', body, true)
            .then((response) => {
                response.json().then((data) => {
                    console.log(`${type} data`, data)
                    setRerender(rerender+1)
                })
            }
        )
    }

    useEffect(() => {
        if(!id){return}
        Request('profile/'+id, 'GET', {}, true)
            .then((response) => {
                response.json().then((data) => {
                    console.log('profile data', data)
                    if(data.msg === 'user not found'){router.push('/404')}
                    setProfileInfo(data)
                })
            }
        )
    }, [id, rerender])

    if (!profileInfo) {return <div></div>}
    const {same_user, user_id, user_email, num_followers, num_following, user_is_followed, user_is_following, num_items} = profileInfo
    if(same_user){router.push('/myprofile')}
    
    return (
        <div className={styles.container}>
            <h1>Profile: {user_email}</h1>
            {user_is_followed && <div>Follows you</div>}
            {user_is_following
                ? <button onClick={()=>handleConnection('unfollow')} className={styles.button}>Unfollow</button>
                : <button onClick={()=>handleConnection('follow')} className={styles.button}>Follow</button>
            }
            <div className={styles.followInfo}>
                <p>Following: {num_following}</p>
                <p>Followers: {num_followers}</p>
            </div>
            <div>Items Saved: {num_items}</div>
        </div>
    )
}
export default Profile