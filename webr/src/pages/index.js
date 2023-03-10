import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import MainView from '@/components/templates/mainView'
import NavBar from '@/components/molecules/navbar'


export default function Home
() {
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
        <MainView archive={false}/>
      </main>
    </>
  )
}
