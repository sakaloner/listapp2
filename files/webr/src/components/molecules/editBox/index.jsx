import styles from './index.module.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { useState, useRef, useEffect } from 'react';
import Request from '@/utils/request';
import Link from 'next/link';

const EditBox = ({type, itemInfo, setEditMode, rerender, setRerender, exploreSave, archive, exploreMode}) => {
    const [tags, setTags] = useState([])
    const [username, setUsername] = useState('Nada')
    const content = useRef(null)
    const link = useRef(null)
    const sliderValue = useRef(null)
    const archived = useRef(null)

    useEffect (() => {
        getTags()
        handle_get_username(itemInfo.owner_id)
        archived.current.checked = itemInfo.archived
        content.current.value = itemInfo.content
        link.current.value = itemInfo.link
        sliderValue.current.value = itemInfo.rating

    }, [])

    const handle_get_username = (id) => {
        Request(`profile/${id}`, 'GET', {}, true)
            .then((response) => {  
                response.json().then((data) => {
                    console.log('username', data)
                    setUsername(data.user_email)
                })
            })
    }

    const getTags = () => {
        console.log('itemInfo', itemInfo)
        Request('get_item_tags', 'GET', {item_id: itemInfo.id_item})
            .then((response) => {
                console.log('tags res', response)
                response.json().then((res) => {
                    const new_tags = res.map((tag) => {
                        return {id: tag.tag_name, text: tag.tag_name}
                    })
                    setTags(new_tags)
                })
            })
            .catch((error) => {
                console.log('error', error)
            })
    }
    const handleEditItem = () => {
        const tag_names = tags.map((tag) => {return tag.text})
        if (exploreSave) {
            let body = {
                ...itemInfo,
                content: content.current.value,
                link: link.current.value,
                rating: sliderValue.current.value,
                tags: tag_names,
                archived: archived.current.checked,
            }
            delete body.owner_id
            delete body.id_item
            console.log('body save thing', body)
            Request('create_item', 'POST', body, true)
            .then((response) => {
                console.log('update res',response)
                setEditMode(false)
            })
            .catch((error) => {
                console.log('error', error)
            })
        } else {
            let body = {
                ...itemInfo,
                content: content.current.value,
                link: link.current.value,
                rating: sliderValue.current.value,
                tags: tag_names,
                archived: archived.current.checked,
            }
            console.log('body req', body)
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
            {exploreMode && <div className={styles.username}>By:<button ><Link href={`/profile/${itemInfo.owner_id}`}>{username}</Link></button></div>}
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
            <input type='checkbox' className={styles.archive} ref={archived}/>archived
            <div className={styles.buttons}>
                {exploreMode
                    ? <><button onClick={handleEditItem} className={styles.button}>Save to your lists </button><button className={`${styles.deleteButton} ${styles.button}`} onClick={()=>setEditMode(false)}>Cancel</button></>
                    :<> <button onClick={handleEditItem} className={styles.button}>Save</button><button className={`${styles.deleteButton} ${styles.button}`} onClick={handleDeleteItem}>Delete</button></>
                }
            </div> 
        </div>
    )
    
}
export default EditBox