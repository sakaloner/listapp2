import styles from './index.module.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { useState, useRef, useEffect } from 'react';
import Request from '@/utils/request';

const EditBox = ({type, itemInfo, setEditMode, rerender, setRerender}) => {
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
                    return {id: tag.tag_name, text: tag.tag_name}
                })
                setTags(new_tags)
            })
            .catch((error) => {
                console.log('error', error)
            })
    }
    const handleEditItem = () => {
        const tag_names = tags.map((tag) => {return tag.text})
        console.log('itemInfo', itemInfo)
        let body = {
            ...itemInfo,
            content: content.current.value,
            link: link.current.value,
            rating: sliderValue.current.value,
            tags: tag_names,
        }
        Request('update_item', 'POST', body)
        .then((response) => {
            console.log('update res',response)
            setRerender(rerender+1)
            setEditMode(false)
        })
        .catch((error) => {
            console.log('error', error)
        })
    }
    const handleDeleteItem = () => {
        const url = `delete_item?id_item=${itemInfo.id_item}`
        Request(url, 'DELETE')
            .then((response) => {
                setRerender(rerender+1)
                setEditMode(false)
            })
            .catch((error) => {
                console.log('error', error)
            })
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
            <button onClick={()=>setEditMode(false)} className={styles.closeButton}>X</button>
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
                <button onClick={handleEditItem} className={styles.button}>Save</button>
                <button className={`${styles.deleteButton} ${styles.button}`} onClick={handleDeleteItem}>Delete</button>
            </div> 
        </div>
    )
    
}
export default EditBox