import styles from './index.module.css'

const ItemCard = ({type,content,rating,tags}) => {
    return (
    <div className={styles.itemCardContainer + " " + styles[type]}>
        <p>{content}</p>
    </div>
  )
}
export default ItemCard