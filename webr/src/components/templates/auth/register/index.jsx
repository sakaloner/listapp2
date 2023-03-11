import styles from './index.module.css'
import { useRef, useState } from 'react'
import request from '@utils/request'
import { useRouter} from 'next/router'

const Register = ({ }) => {
    const email = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const [message, setErrorMsg] = useState({
        msg: '',
        type: '',
    })
    const styleMsg = (message.type === 'error') ? 'error': 'success'
    const router = useRouter()

    const onSubmitForm = (e) => {
        let body
        e.preventDefault()
        if (password.current?.value !== confirmPassword.current?.value) {
            setErrorMsg({msg:"Oops! The passwords don't match", type:'error'})
            return
        }
        const secondPartEmail = email.current?.value.split('@')[1]
        if (!secondPartEmail?.includes('.')) {
            setErrorMsg({msg:"Invalid email", type:'error'})
        }
        if (email.current && password.current)
            body = {
                email: (email.current.value.toLowerCase()),
                password: password.current.value,
            }
        request('user_create', 'POST', body)
            .then((res) => {
                console.log('pasooo')
                console.log('res', res)
                const { status } = res
                console.log('status', status)
                if (status === 400) {
                    setErrorMsg({msg:"The email is already registered", type:'error'})
                    return
                }
                if (status === 200) {
                    setErrorMsg({msg:"Successfully registered!", type:'success'})
                    setTimeout(() => {router.push('/login')}, 1000)
                    return
                } 
                setErrorMsg({msg:"Oops! there was a problem", type:'error'})
                return
            })
            .catch((res) => {
                console.log('problema')
                setErrorMsg({msg:"Oops there is a problem!", type:'error'})
            })
    }
    
    return (
        <div className={styles.container}>
            <i className={`icon-university ${styles.icon} ` }></i>
            <h1>Register</h1>
            <h1>Welcome to Listapp!</h1>
            <form className={styles.form} onSubmit={onSubmitForm}>
                <input className={styles.input} placeholder='Email' required type='email' ref={email} />
                <input className={styles.input} placeholder='Password' required type='password' minlength={8} ref={password} />
                <input className={styles.input} placeholder='Confirm password' required type='password' minlength={8} ref={confirmPassword} />
                <div className={`${styles.msg} ${styles[styleMsg]}`}>{message.msg}</div>
                <button className={styles.button} variant='filled' type='submit'>SIGN UP</button>
            </form>
            <Link href="/login"><p>Do you already have an account? login here</p></Link>
        </div>
    )
}
export default Register