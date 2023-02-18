import styles from './index.module.css'
import { useState } from 'react';

const SearchBar = ({ searchMsg, searchValue, handleOnChangeSearch, handleKeyDown, setSearchInfo, searchInfo}) => {
    const handleCloseSearch = () => {
        setSearchInfo({
            ...searchInfo,
            enter: 0,
            searchValue: '',
        })
    }            
    return (
        <div className={styles.container}>
            <input onKeyDown={handleKeyDown} className={styles.input} onChange={handleOnChangeSearch} value={searchValue} placeholder={searchMsg}/>
            {!!searchInfo.enter && <button onClick={handleCloseSearch} className={styles.closeSearch}>X</button>}
        </div>
    )
}
export default SearchBar
