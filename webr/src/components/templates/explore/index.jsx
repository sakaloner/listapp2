import ExploreBox from "@/components/organisms/exploreBox"
import CategoryView from "@/components/organisms/categoryView"
import SearchBar from "@/components/molecules/searchBar"
import styles from './index.module.css'
import { useState } from 'react'

const ExploreView = () => {
    const [searchInfo, setSearchInfo] = useState({
        searchValue: '',
        enter: 0
    })

    const handleOnChangeSearch = (e) => {
        setSearchInfo({
            enter: 0,
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
                searchMsg="Explore the world of knowledge"
                handleOnChangeSearch={handleOnChangeSearch}
                searchValue={searchInfo.searchValue}
                activeSearch={searchInfo.enter}
                setSearchInfo={setSearchInfo}
                searchInfo={searchInfo}
            />
            <ExploreBox searchInfo={searchInfo} setSearchInfo={setSearchInfo}/>
            {/* {(viewType==='boxView')
                ?<BoxView searchInfo={searchInfo} setSearchInfo={setSearchInfo} archive={archive}/>
                :<CategoryView searchInfo={searchInfo} setSearchInfo={setSearchInfo} archive={archive}/>
            } */}
        </div>
    )
}
export default ExploreView