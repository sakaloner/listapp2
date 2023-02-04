import CarouselBox from "@/components/molecules/carouselBox"
import SearchBar from "@/components/molecules/searchBar"
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
        fetch("http://localhost:8000/get_top_tags?user=andy")
          .then((response) => response.json())
          .then((res) => {
            console.log(res)
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
                            title={tag.tag}
                            key={index}
                            tag_id={tag.id}
                        />
                    )
                })}
                <CarouselBox title="Videos"/>
                {/* <CarouselBox title="Podcasts"/>
                <CarouselBox title="Books"/>
                <CarouselBox title="Articles"/> */}
            </div>
        </div>
    )
}
export default CategoryView