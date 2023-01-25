import MainBox from "@/components/molecules/mainBox"
import SearchBar from "@/components/molecules/searchBar"
import styles from './index.module.css'
import { useState } from 'react'

const MainView = () => {
    const [searchValue, setSearchValue] = useState(null);

    const handleOnChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }

    return (
        <div className={styles.container}>
            <SearchBar 
                searchMsg="Search in your lists"
                handleOnChangeSearch={handleOnChangeSearch}
                searchValue={searchValue}
                />
            <MainBox searchValue={searchValue}/>
        </div>
    )
}
export default MainView