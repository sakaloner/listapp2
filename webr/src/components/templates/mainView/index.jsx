import MainBox from "@/components/molecules/mainBox"
import SearchBar from "@/components/molecules/searchBar"
import styles from './index.module.css'
import { useState } from 'react'

const MainView = () => {
    const [searchValue, setSearchValue] = useState('');
    const [orderItems, setOrderItems] = useState('rating');

    const handleOnChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }
    const handleSelectChange = (e) => {
        setOrderItems(e.target.value)
    }

    return (
        <div className={styles.container}>
            <SearchBar 
                searchMsg="Search in your lists"
                handleOnChangeSearch={handleOnChangeSearch}
                searchValue={searchValue}
            />
            <select onChange={handleSelectChange}>
                <option value="rating">Rating</option>
                <option value="date">Creation Date</option>
            </select>
            <MainBox searchValue={searchValue} orderItems={orderItems}/>
        </div>
    )
}
export default MainView