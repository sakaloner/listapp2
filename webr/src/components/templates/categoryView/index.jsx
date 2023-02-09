import CarouselBox from "@/components/molecules/carouselBox"
import SearchBar from "@/components/molecules/searchBar"
import Request from "@utils/request"
import styles from './index.module.css'
import { useState, useEffect } from 'react'

const CategoryView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [itemsInfo, setItemsInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [typeDisplay, setTypeDisplay] = useState('random');

    const handleOnChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }
    const handleTypeChange = (e) => {
        console.log(e.target.value)
        setTypeDisplay(e.target.value)
        getTags(e.target.value)
    }
    const getTags = (type) => {
        const data = {
            owner_id:4,
            type:type,
        }
        console.log('data category',data)
        Request("get_tags", "GET", data)
            .then((res) => {
                setIsLoading(false)
                console.log('tags res',res)
                setItemsInfo(res)
                setIsLoading(false)
            })
            .catch((error) => { console.log('error', error) })
    }
    useEffect(() => {
        getTags(typeDisplay)
    }, []);

    return (
        <div className={styles.container}>
            <SearchBar 
                searchMsg="Search list categories"
                searchValue={searchValue}
                handleOnChangeSearch={handleOnChangeSearch}
            />
            <select onChange={handleTypeChange}>
                <option value="random">Random</option>
                <option value="rating">Rating</option>
                <option value="num_items">Num Items</option>
            </select>
            <div className={styles.carouselsContainer}>
                {isLoading && <p>Loading...</p>}
                {itemsInfo && itemsInfo.map((tag, index) => {
                    return (
                        <CarouselBox 
                            title={tag.tag_name}
                            key={index}
                            tag_id={tag.id_tag}
                        />
                    )
                })}

            </div>
        </div>
    )
}
export default CategoryView