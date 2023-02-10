import ItemCard from '@molecules/itemCard'
import styles from './index.module.css'
import { useState, useEffect } from 'react'
import Request from '@utils/request'
import AddBox from '@molecules/addBox'

const MainBox = ({searchValue, orderItems}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);
    const [rerender, setRerender] = useState(0)

    useEffect(() => {
        getItems()
    }, [orderItems, rerender]);

    const getItems = () => {
        const data = {
            owner_id: 4,
            order_by: orderItems,
        }
        Request('get_items', 'GET', data)
        .then((response) => {
            setIsLoading(false)
            setItemsInfo(response)
            setIsLoading(false)
        })
        .catch((error) => {
            console.log('error', error)
        })
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.boxContainer}>
                {!searchValue && <AddBox type="mainBox" getItems={getItems}/>}
                {isLoading && <div>Loading...</div>}
                {itemsInfo && itemsInfo.map((item, index) => {
                    if (searchValue && item.content.includes(searchValue)) {
                        return (
                            <ItemCard 
                                key={index}
                                itemInfo={item}
                                type="mainBox"
                                setRerender={setRerender}
                                rerender={rerender}
                            />
                        )
                    } else if (!searchValue) {
                        return (
                            <ItemCard 
                                key={index}
                                itemInfo={item}
                                type="mainBox"
                                setRerender={setRerender}
                                rerender={rerender}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default MainBox