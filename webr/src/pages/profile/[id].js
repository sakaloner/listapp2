import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Profile from '@/components/templates/profile'
import NavBar from '@/components/molecules/navbar'
import {useRouter} from 'next/router'

export default function Home () {
  const router = useRouter()
  const {id} = router.query
  return (
    <>
      <Head>
        <title>Listapp</title>
        <meta name="description" content="Generated by Pips" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <NavBar/>
        <Profile id={id}/>
      </main>
    </>
  )
}