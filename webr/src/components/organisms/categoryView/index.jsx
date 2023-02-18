import CarouselBox from "@/components/molecules/carouselBox"
import Request from "@/utils/request"
import styles from './index.module.css'
import { useState, useEffect } from 'react'

const CategoryView = ({searchInfo, archive}) => {
    const [itemsInfo, setItemsInfo] = useState(null);
    const [orderItems, setOrderItems] = useState('random');
    const [searchItems, setSearchItems] = useState(null);
    const {searchValue, enter} = searchInfo
    
    const handleTypeChange = (e) => {
        console.log(e.target.value)
        setOrderItems(e.target.value)
        getTags(e.target.value)
    }
    const getTags = (type) => {
        const data = {
            owner_id:4,
            type:type,
            archive: archive,
        }
        console.log('data category',data)
        Request("get_tags", "GET", data)
            .then((res) => {
                res.json().then((data) => {
                    console.log('tags res',data)
                    setItemsInfo(data)
                })
            })
            .catch((error) => { console.log('error', error) })
    }
    // search 
    useEffect(() => {
        console.log('enter value', searchInfo.enter)
        if (searchInfo.enter > 0 && searchValue && !searchItems) {
            const data = {
                owner_id: 4,
                search: searchValue,
                order_by: orderItems,
                skip: 0,
                limit: 20,
                archive: archive,
            }
            Request('search_user_items_categories', 'GET', data)
            .then((response) => {
                response.json().then((data) => {
                    console.log('finished search')
                    setSearchItems(data)
                })
            })
            .catch((error) => {
                console.log('error', error)
            })
        }
    }), [searchInfo.enter]

    useEffect(() => {
        getTags(orderItems)
    }, []);

    return (
        <div className={styles.container}>
            <select onChange={handleTypeChange}>
                <option value="random">Random</option>
                <option value="rating">Rating</option>
                <option value="num_items">Num Items</option>
            </select>
            <div className={styles.carouselsContainer}>
                {!itemsInfo && <p>Loading...</p>}
                {!!searchInfo.enter &&  searchItems && searchItems.map((tag, index) => {
                    return (
                        <CarouselBox 
                        title={tag.tag_name}
                        key={index}
                        tag_id={tag.id_tag}
                    />
                    )
                })}
                {itemsInfo && !!!searchInfo.enter && itemsInfo.map((tag, index) => {
                    if (searchValue && tag.tag_name.includes(searchValue)) {
                        return (
                            <CarouselBox 
                                title={tag.tag_name}
                                key={index}
                                tag_id={tag.id_tag}
                                archive={archive}
                            />
                        )
                    } else if (!searchValue) {
                        return (
                            <CarouselBox 
                                title={tag.tag_name}
                                key={index}
                                tag_id={tag.id_tag}
                                archive={archive}
                            />
                        )
                    }
                })}
                {/* {itemsInfo && itemsInfo.map((tag, index) => {
                    return (
                        <CarouselBox 
                            title={tag.tag_name}
                            key={index}
                            tag_id={tag.id_tag}
                        />
                    )
                })} */}

            </div>
        </div>
    )
}
export default CategoryView
