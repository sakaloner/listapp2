import ItemCard from '@molecules/itemCard'
import styles from './index.module.css'
import Request from '@utils/request'
import AddBox from '@molecules/addBox'
import { useState, useEffect } from 'react'

const BoxView = ({searchInfo, setSearchInfo, archive}) => {
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
        if (searchInfo.enter > 0 && searchValue && !searchItems) {
            const data = {
                owner_id: 4,
                search: searchValue,
                order_by: orderItems,
                skip: 0,
                limit: 20,
                archive: archive,
            }
            Request('search_items_mainBox', 'GET', data)
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
    }), [searchInfo.enter, rerender]
    // main fetch
    useEffect(() => {
        getItems()
    }, [orderItems, rerender]);

    const getItems = () => {
        const data = {
            owner_id: 4,
            order_by: orderItems,
            archive: archive,
        }
        Request('get_items', 'GET', data)
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
                {!searchValue && <AddBox type="mainBox" getItems={getItems}/>}
                {!itemsInfo && <div>Loading...</div>}
                {!!searchInfo.enter &&  searchItems && searchItems.map((item, index) => {
                    return (
                        <ItemCard 
                            key={index}
                            itemInfo={item}
                            type="mainBox"
                            setRerender={setRerender}
                            rerender={rerender}
                            archive={archive}
                        />
                    )
                })}
                {console.log(itemsInfo)}
                {itemsInfo && !!!searchInfo.enter && itemsInfo.map((item, index) => {
                    if (searchValue && item.content.includes(searchValue)) {
                        return (
                            <ItemCard 
                                key={index}
                                itemInfo={item}
                                type="mainBox"
                                setRerender={setRerender}
                                rerender={rerender}
                                archive={archive}

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
                                archive={archive}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default BoxView

