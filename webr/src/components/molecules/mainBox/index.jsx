import ItemCard from '../itemCard'
import styles from './index.module.css'
import { useState, useEffect } from 'react'
import AddBox from '../addBox'

const MainBox = ({searchValue}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);

    // useEffect(() => {
    //     fetch("http://localhost:8000/get_items?user=andy")
    //       .then((response) => response.json())
    //       .then((res) => {
    //         console.log(res)
    //         setItemsInfo(res)
    //       });
    //   }, []);
    
    return (
        <div className={styles.container}>
            <div className={styles.boxContainer}>
                <AddBox type="mainBox"/>
                {console.log('items', itemsInfo)}
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