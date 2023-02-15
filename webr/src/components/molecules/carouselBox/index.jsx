import ItemCard from "../itemCard"
import styles from './index.module.css'
import Request from '@utils/request'
import { useState, useEffect } from 'react'


const CarouselBox = ({title, tag_id, searchValue}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);
    const [rerender, setRerender] = useState(0)

    const getItems = () => {
        const data = {
            owner_id: 4,
            tag_id: tag_id
        }
        Request('get_items_by_tag', 'GET', data)
            .then((response) => {
                console.log('res', response)
                response.json().then((res) => {
                    console.log(res)
                    if (res.length === 0 || res.message) {
                        setItemsInfo(null)
                    } else {
                        setItemsInfo(res)
                    }
                    return
                })
            })
            .catch((error) => {
                console.log('error', error)
            });
    }

    useEffect(() => {
        getItems()
    }, [tag_id,rerender]);

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <div className={styles.itemsContainer}>
                {itemsInfo && itemsInfo.map((item, index) => {
                    return (
                        <ItemCard 
                            key={index}
                            type="carousel"
                            itemInfo={item}
                            rerender={rerender}
                            setRerender={setRerender}
                        />
                    )
                })
                }
            </div>
        </div>
    )
}
export default CarouselBox

