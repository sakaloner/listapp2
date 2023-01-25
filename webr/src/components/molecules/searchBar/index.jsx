import styles from './index.module.css'
import { useState } from 'react';

const SearchBar = ({ searchMsg, searchValue, handleOnChangeSearch }) => {
    return (
        <div className={styles.container}>
            <input className={styles.input} onChange={handleOnChangeSearch} value={searchValue} placeholder={searchMsg}/>
        </div>
    )
}
export default SearchBar
