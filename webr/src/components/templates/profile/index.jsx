import styles from './index.module.css'
const Profile = () => {
    return (
        <div className={styles.container}>
            <h1>Profile: Profile Name</h1>
            <button className={styles.button}>Follow</button>
            <div className={styles.followInfo}>
                <p>Following: 30</p>
                <p>Followers: 600</p>
            </div>
        </div>
    )
}
export default Profile