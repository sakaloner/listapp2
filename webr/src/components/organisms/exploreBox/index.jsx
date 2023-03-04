import ItemCard from '@molecules/itemCard'
import styles from './index.module.css'
import Request from '@utils/request'
import AddBox from '@molecules/addBox'
import { useState, useEffect } from 'react'

const ExploreBox = ({searchInfo, setSearchInfo}) => {
    const [itemsInfo, setItemsInfo] = useState(null);
    const [rerender, setRerender] = useState(0)
    const [orderItems, setOrderItems] = useState('rating');
    const [searchItems, setSearchItems] = useState(null);
    const {searchValue, enter} = searchInfo

    const handleSelectChange = (e) => {
        setOrderItems(e.target.value)
    }
    // search 
    useEffect(() => {
        console.log('enter value', searchInfo.enter)
        if (searchInfo.enter > 0 && searchValue) {
            const data = {
                search: searchValue,
                order_by: orderItems,
                skip: 0,
                limit: 20,
            }
            Request('search_all_items', 'GET', data, true)
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
    }, [enter, rerender])
    // main fetch
    useEffect(() => {
        getItems()
    }, [orderItems, rerender, enter]);

    const getItems = () => {
        const data = {
            order_by: orderItems,
        }
        Request('get_recs', 'GET', data, true)
        .then((response) => {
            response.json().then((data) => {
                setItemsInfo(data)
            })
        })
        .catch((error) => {
            console.log('error', error)
        })
    }
    
    return (
        <div className={styles.container}>
            <select onChange={handleSelectChange}>
                <option value="rating">Rating</option>
                <option value="date">Creation Date</option>
            </select>
            <div className={styles.boxContainer}>
                {!itemsInfo && <div>Loading...</div>}
                {!!searchInfo.enter &&  searchItems && searchItems.map((item, index) => {
                    return (
                        <ItemCard 
                            key={index}
                            itemInfo={item}
                            type="mainBox"
                            setRerender={setRerender}
                            rerender={rerender}
                            archive={false}
                            exploreMode={true}
                        />
                    )
                })}
                {!Array.isArray(itemsInfo) && <div>Loading...</div>}
                {itemsInfo && Array.isArray(itemsInfo) && !!!searchInfo.enter && itemsInfo.map((item, index) => {
                    if (searchValue && item.content.includes(searchValue)) {
                        return (
                            <ItemCard 
                                key={index}
                                itemInfo={item}
                                type="mainBox"
                                setRerender={setRerender}
                                rerender={rerender}
                                archive={false}
                                exploreMode={true}

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
                                archive={false}
                                exploreMode={true}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default ExploreBox

