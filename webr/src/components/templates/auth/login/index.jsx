import styles from './index.module.css'
import { setTokenCookie } from '@utils/cookies'
import Request from '@utils/request'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'

const Login = () =>{
    const email = useRef(null)
    const password = useRef(null)
    const [message, setMessage] = useState({
        msg: '',
        type: '',
    })
    const styleMsg = (message.type === 'error') ? 'error': 'success'
    const router = useRouter()
    const {isReady} = router
    const{ telegram_id} = router.query

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            username: email.current?.value,
            password: password.current?.value
        }
        const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
        const body = toUrlEncoded(data)
        Request('token', 'POST', body, false, 'application/x-www-form-urlencoded')
        .then((res)=>{
            console.log('res', res)
            const {status} = res
            if (status === 200) {
                res.json().then((data)=>{
                    console.log(data)
                    return
                    setTokenCookie(data.access_token)
                    setMessage({msg: 'Successfully logged in', type: 'success'})
                    setTimeout(()=>router.push('/'), 1000)
                    return 
                })
            } 
            if (status === 401) {
                setMessage({msg: 'Incorrect email or password', type: 'success'})
                return
            }
            if (status === 404) {
                setMessage({msg: 'Error', type: 'success'})
                return
            }
            setMessage({msg: 'Error', type: 'success'})

        })
        .catch((err)=> {
            console.log('error', err)
            setMessage({msg: 'Error', type: 'success'})
        }) 

    }

    if (!isReady) return <div>loading</div>
    console.log('telegram_id', telegram_id)
    return (
        <div className={styles.container}>
            <i className={`icon-university ${styles.icon} ` }></i>
            <h1>Log into your library</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.input} placeholder='Email' label='Your email' required type='email' ref={email}/>
                <input className={styles.input} placeholder='Password' label='Your password' required type='password' minLength={8} ref={password}/>
                <div className={`${styles.msg} ${styles[styleMsg]}`}>{message.msg}</div>
                <button className={styles.button} variant='filled' type='submit'>Sign in</button>
            </form>
        </div>            
    )
}
export default Login
