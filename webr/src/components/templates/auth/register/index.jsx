import styles from './index.module.css'
import { useRef, useState } from 'react'
import request from '@utils/request'

const Register = ({ }) => {
    const email = useRef(null)
    const password = useRef(null)
    const confirmPassword = useRef(null)
    const userName = useRef(null)

    const onSubmitForm = (e) => {
        let body
        e.preventDefault()
        if (password.current?.value !== confirmPassword.current?.value) {
            toastCallback("Oops! The passwords don't match", 'error')
            return
        }
        const secondPartEmail = email.current?.value.split('@')[1]
        if (!secondPartEmail?.includes('.')) {
            toastCallback("Invalid email", 'error')
            return
        }
        if (email.current && password.current && userName.current)
            body = {
                email: (email.current.value.toLowerCase()),
                nick: userName.current.value,
                password: password.current.value,
            }
        request('Users/Register', 'POST', body, false)
            .then((res) => {
                const {status} = res
                if (status === 404) {
                    toastCallback("User already exists", "error")
                    return
                }
                if (status === 200) {
                    toastCallback("succesfully registered", "success")
                    return
                } 
                toastCallback("Oops! We have a problem.", "error")
                return
            })
            .catch((res) => {
                toastCallback("Oops! There is a problem.", "error")
            })
    }
    
    return (
        <div className={styles.container}>
            <span>Icon</span>
            <h1>Welcome to Listapp!</h1>
            <h1>Register down below</h1>
            <form className={styles.form} onSubmit={onSubmitForm}>
                <input className={styles.input} placeholder='Email' label='Your email' required type='email' refInput={email} />
                <input className={styles.input} placeholder='Password' label='Your password' required type='password' minlength={8} refInput={password} />
                <input className={styles.input} placeholder='Confirm password' label='Your confirmed password' required type='password' minlength={8} refInput={confirmPassword} />
                <input className={styles.input} placeholder='Username' label='Your username' required type='text' minlength={5} refInput={userName} />
                <button className={styles.button} variant='filled' type='submit'>SIGN UP</button>
            </form>
        </div>
    )
}
export default Register