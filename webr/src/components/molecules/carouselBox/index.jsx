import ItemCard from "../itemCard"
import styles from './index.module.css'
import Request from '@utils/request'
import { useState, useEffect } from 'react'


const CarouselBox = ({title, tag_id, searchValue}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);

    useEffect(() => {
        const data = {
            owner_id: 1,
            tag_id: tag_id
        }
        Request('get_items_by_tag', 'GET', data)
            .then((res) => {
                if (res.length === 0 || res.message) {
                    setItemsInfo(null)
                } else {
                    setItemsInfo(res)
                }
            })
            .catch((error) => {
                console.log('error', error)
            });
        }, []);

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <div className={styles.itemsContainer}>
                {console.log('itemsInfo', itemsInfo)}
                {itemsInfo && itemsInfo.map((item, index) => {
                    console.log('items', itemsInfo)
                        return (
                            <ItemCard 
                                key={index}
                                type="carousel"
                                content={item.content} 
                                rating={item.rating} 
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default CarouselBox

