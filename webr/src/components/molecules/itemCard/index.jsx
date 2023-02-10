import styles from './index.module.css'
import { useState } from 'react'
import EditBox from '../editBox'

const ItemCard = ({type,itemInfo, setRerender, rerender}) => {
  const [editMode, setEditMode] = useState(false)
  if (!editMode) {
    return (
      <div onClick={()=>setEditMode(!editMode)} className={styles.itemCardContainer + " " + styles[type]}>
          <p>{itemInfo.content}</p>
      </div>
    )
  } else {
    return (
      <EditBox type="mainBox" itemInfo={itemInfo} setEditMode={setEditMode} rerender={rerender} setRerender={setRerender}/>
    )
  }
}
export default ItemCard