import CarouselBox from "@/components/molecules/carouselBox"
import SearchBar from "@/components/molecules/searchBar"
import Request from "@utils/request"
import styles from './index.module.css'
import { useState, useEffect } from 'react'

const CategoryView = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [itemsInfo, setItemsInfo] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const handleOnChangeSearch = (e) => {
        setSearchValue(e.target.value)
    }

    useEffect(() => {
        const data = {
            owner_id:1,
            type:'num_items'
        }
        Request("get_tags", "GET", data)
            .then((res) => {
                console.log('tags res',res)
                setItemsInfo(res)
            })            
    }, []);

    return (
        <div className={styles.container}>
            <SearchBar 
                searchMsg="Search list categories"
                searchValue={searchValue}
                handleOnChangeSearch={handleOnChangeSearch}
            />
            <div className={styles.carouselsContainer}>
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