import styles from './index.module.css'
import { setTokenCookie } from '@utils/cookies'
import request from '@utils/request'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'

const Login = () =>{
    const [fetchLoading, setLoading] = useState(false)
    const email = useRef(null)
    const password = useRef(null)
    const [message, setMessage] = useState({
        msg: '',
        type: '',
    })
    const styleMsg = (message.type === 'error') ? 'error': 'success'
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            username: email.current?.value,
            password: password.current?.value
        }
        const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
        const body = toUrlEncoded(data)
        request('token', 'POST', body, 'application/x-www-form-urlencoded')
        .then((res)=>{
            console.log('res', res)
            const {status} = res
            setLoading(false)
            if (status === 200) {
                res.json().then((data)=>{
                    console.log(data)
                    setTokenCookie(data.access_token)
                    setMessage({msg: 'Successfully logged in', type: 'success'})
                    //setTimeout(()=>router.push('/home'), 1000)
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
            setLoading(false)
            console.log('error', err)
            setMessage({msg: 'Error', type: 'success'})
        }) 

    }

    return (
        <div className={styles.container}>
            <span>Icon</span>
            <h1>Log In</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.input} placeholder='Email' label='Your email' required type='email' ref={email}/>
                <input className={styles.input} placeholder='Password' label='Your password' required type='password' minlength={8} ref={password}/>
                <div className={`${styles.msg} ${styles[styleMsg]}`}>{message.msg}</div>
                <button className={styles.button} variant='filled' type='submit' loading={fetchLoading}>Sign in</button>
            </form>
        </div>            
    )
}
export default Login