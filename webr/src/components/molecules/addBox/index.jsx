import styles from './index.module.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { useState, useRef } from 'react';
import Request from '@/utils/request';

const AddBox= ({type, getItems}) => {
    const [editMode, setEditMode] = useState(false)
    const [tags, setTags] = useState([])

    const content = useRef(null)
    const link = useRef(null)
    const sliderValue = useRef(null)

    const cleanData = () => {
        content.current.value = ''
        link.current.value = ''
        sliderValue.current.value = 0
        setTags([])
    }
    const handleSaveItem = () => {
        console.log('tags', tags)
        const cleanTags = tags.map((tag) => {
            return tag.text
        })
        const data = {
            content: content.current.value,
            link: link.current.value,
            rating: sliderValue.current.value,
            tags: cleanTags,
        }
        console.log('data to save', cleanTags)
        Request('create_item', 'POST', data, true)
        .then((response) => {
            console.log('save res',response)
            getItems()
            cleanData()
            setEditMode(false)
            console.log('Items Inf', itemsInfo)
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
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };
    
    if (editMode) {
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
                    handleDrag={handleDrag}
                    autocomplete
                />
                <div className={styles.buttons}>
                    <button onClick={handleSaveItem} className={styles.button}>Save</button>
                </div> 
            </div>
        )
    } else {
        return (
            <div onClick={()=>setEditMode(true)} className={styles.itemCardContainer + " " + styles[type]}>
                <p>+</p>
            </div>
        )
    }
}
export default AddBox