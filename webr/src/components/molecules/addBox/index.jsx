import styles from './index.module.css'
import { WithContext as ReactTags } from 'react-tag-input';
import { useState } from 'react';
const AddBox= ({type}) => {
    const [editMode, setEditMode] = useState(false)
    const [tags, setTags] = useState([])

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
                <div className={styles.inputs}>
                    <input className={styles.input} placeholder="Content"/>
                    <input className={styles.input} placeholder="Link"/>
                </div>
                <input type='range' min='0' max='100' className={styles.slider} id='myRange'/>
                <ReactTags
                    tags={tags}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    autocomplete
                />
                <div className={styles.buttons}>
                    <button className={styles.button}>Add</button>
                    <button onClick={()=>setEditMode(false)} className={styles.button}>Cancel</button>
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