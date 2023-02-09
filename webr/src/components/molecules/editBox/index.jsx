import styles from './index.module.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { useState, useRef, useEffect } from 'react';
import Request from '@/utils/request';

const EditBox = ({type, itemInfo, changeMode}) => {
    const [tags, setTags] = useState([])
    const content = useRef(null)
    const link = useRef(null)
    const sliderValue = useRef(null)

    useEffect (() => {
        getTags()
        content.current.value = itemInfo.content
        link.current.value = itemInfo.link
        sliderValue.current.value = itemInfo.rating
    }, [])

    const getTags = () => {
        console.log('itemInfo', itemInfo)
        Request('get_item_tags', 'GET', {item_id: itemInfo.id_item})
            .then((response) => {
                console.log('tags res', response)
                const new_tags = response.map((tag) => {
                    return {id: tag.id_tag, text: tag.tag_name}
                })
                setTags(new_tags)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }
    const handleEditItem = () => {
        // console.log('tags', tags)
        // const cleanTags = tags.map((tag) => {
        //     return tag.text
        // })
        // const data = {
        //     content: content.current.value,
        //     link: link.current.value,
        //     rating: sliderValue.current.value,
        //     tags: cleanTags,
        //     owner_id: 4,
        // }
        // console.log('data to save', cleanTags)
        // Request('create_item', 'POST', data)
        // .then((response) => {
        //     console.log('save res',response)
        //     getItems()
        //     cleanData()
        //     setEditMode(false)
        //     console.log('Items Inf', itemsInfo)
        // })
        // .catch((error) => {
        //     console.log('error', error)
        // })
    }
    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };
    const handleAddition = tag => {
        setTags([...tags, tag]);
        console.log('tags state', tags)
    };
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };

    return (
        <div className={styles.itemCardContainer + " " + styles[type]}>
            <div className={styles.inputs}>
                <input ref={content} className={styles.input} placeholder="Content"/>
                <input ref={link} className={styles.input} placeholder="Link"/>
            </div>
            <input ref={sliderValue} type='range' min='0' max='100' className={styles.slider} id='myRange'/>
            <ReactTags
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                autocomplete
            />
            <div className={styles.buttons}>
                <button onClick={null} className={styles.button}>Save</button>
                <button onClick={changeMode} className={styles.button}>Cancel</button>
            </div> 
        </div>
    )
    
}
export default EditBox