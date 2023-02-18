import BoxView from "@/components/organisms/boxView"
import CategoryView from "@/components/organisms/categoryView"
import SearchBar from "@/components/molecules/searchBar"
import styles from './index.module.css'
import { useState } from 'react'

const MainView = ({archive}) => {
    const [viewType, setViewType] = useState('boxView')
    const [searchInfo, setSearchInfo] = useState({
        searchValue: '',
        enter: 0
    })

    const handleOnChangeSearch = (e) => {
        setSearchInfo({
            ...searchInfo,
            searchValue: e.target.value,
        })
    }
    const handleSelectChange = (e) => {
        setViewType(e.target.value)
    }
    const handleEnterSearch = (e) => {
        if (e.key === 'Enter') {
            console.log('enter')
            if (searchInfo.searchValue !== '') {
                setSearchInfo({
                    ...searchInfo,
                    enter: searchInfo.enter + 1,
                })
            }
        }
    }
    return (
        <div className={styles.container}>
            <SearchBar
                handleKeyDown={handleEnterSearch}                
                searchMsg="Search in your lists"
                handleOnChangeSearch={handleOnChangeSearch}
                searchValue={searchInfo.searchValue}
                activeSearch={searchInfo.enter}
                setSearchInfo={setSearchInfo}
                searchInfo={searchInfo}
            />
            <select onChange={handleSelectChange}>
                <option value="boxView">Items View</option>
                <option value="categoryView">Tags View</option>
            </select>
            {(viewType==='boxView')
                ?<BoxView searchInfo={searchInfo} setSearchInfo={setSearchInfo} archive={archive}/>
                :<CategoryView searchInfo={searchInfo} setSearchInfo={setSearchInfo} archive={archive}/>
            }
        </div>
    )
}
export default MainView