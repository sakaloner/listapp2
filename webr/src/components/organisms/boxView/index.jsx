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

    console.log('searchValue', searchValue)
    const handleSelectChange = (e) => {
        setOrderItems(e.target.value)
    }
    // search 
    useEffect(() => {
        // console.log('Search value', searchValue, 'enter', enter)
        if (searchInfo.enter > 0 && searchValue ) {
            console.log('calling the request')
            const data = {
                search: searchValue,
                order_by: orderItems,
                skip: 0,
                limit: 50,
                archive: archive,
            }
            Request('search_items_mainBox', 'GET', data, true)
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
    }, [orderItems, rerender, enter, searchValue]);

    const getItems = () => {
        const data = {
            order_by: orderItems,
            archive: archive,
        }
        Request('get_items', 'GET', data, true)
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
                {console.log('!!!searchInfo.enter', !!enter, enter, 'itemsInfo', itemsInfo)}
                {itemsInfo  && !!!searchInfo.enter && itemsInfo.map((item, index) => {
                    console.log('gato')
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
                {!!searchInfo.enter &&  searchItems && searchItems.map((item, index) => {
                    console.log('perro')
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
                {!Array.isArray(itemsInfo) && <div>Loading...</div>}

            </div>
        </div>
    )
}

export default BoxView

