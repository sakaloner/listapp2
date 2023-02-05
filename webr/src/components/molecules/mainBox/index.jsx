import ItemCard from '@molecules/itemCard'
import styles from './index.module.css'
import { useState, useEffect } from 'react'
import Request from '@utils/request'
import AddBox from '@molecules/addBox'

const MainBox = ({searchValue}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);

    useEffect(() => {
        const data = {
            owner_id: 1,
        }
        Request('get_items', 'GET', data)
        .then((response) => {
            console.log(response)
            setItemsInfo(response)
            setIsLoading(false)
        })
        .catch((error) => {
            console.log('error', error)
        })
    }, []);
    
    return (
        <div className={styles.container}>
            <div className={styles.boxContainer}>
                <AddBox type="mainBox"/>
                {itemsInfo && itemsInfo.map((item, index) => {
                    if (searchValue && item.content.includes(searchValue)) {
                        return (
                            <ItemCard 
                            key={index}
                            type="mainBox"
                            content={item.content} 
                            rating={item.rating} 
                            tags={item.tags}
                            />
                        )
                    } else if (!searchValue) {
                        return (
                            <ItemCard 
                            key={index}
                            type="mainBox"
                            content={item.content} 
                            rating={item.rating} 
                            tags={item.tags}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default MainBox