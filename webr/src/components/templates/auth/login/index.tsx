import styles from './index.module.css'
import Input from '../../atoms/input'
import Button from '../../atoms/button'
import { setTokenCookie } from '../../../services/cookies'
import { ToastFunction } from '../../../interface/toast'
import request from '../../../services/request'
import { useRef, useState } from 'react'
import LeviathanLoader from '../../atoms/leviathanLoader'
import { useRouter } from 'next/router'

const Login: React.FC<ToastFunction> = ({toastCallback}) =>{
    const [fetchLoading, setLoading] = useState(false)
    const email = useRef<null | HTMLInputElement> (null)
    const password = useRef<null | HTMLInputElement> (null)
    const router = useRouter()

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const body = {
            email: email.current?.value,
            password: password.current?.value
        }
        request('Users/Login', 'POST', body, false)
        .then((res)=>{
            const {status, data} = res
            setLoading(false)
            if (status === 200) {
                toastCallback("succesfully logged in", "success")
                setTokenCookie(data.token)
                setTimeout(()=>router.push('/home'), 1000)
                return 
            } 
            if (status === 401) {
                toastCallback("Invalid email or password", "error")
                return
            }
            if (status === 404) {
                toastCallback("Invalid email", "error")
                return
            }
            toastCallback("Oops! there is problem.", "error")
        })
        .catch(()=> {
            setLoading(false)
            toastCallback("Oops! there was an unknown problem.", "error")
        }) 

    }

    return (
        <div className={styles.contLogin}>
            <span className='icon-lw'></span>
            <h2>Welcome to Leaviathan War!</h2>
            <h4>Log in with your data here!</h4>
            <form onSubmit={handleSubmit}>
                <Input placeholder='Email' label='Your email' required type='email' refInput={email}/>
                <Input placeholder='Password' label='Your password' required type='password' minlength={8} refInput={password}/><br/>
                <Button variant='filled' type='submit' loading={fetchLoading}>LETS GO</Button>
            </form>
        </div>            
    )
}
export default Login
