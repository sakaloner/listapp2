import ItemCard from "../itemCard"
import styles from './index.module.css'
import { useState, useEffect } from 'react'

const itemsInCarousel = [
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
    {content:'perrito', rating:58, tags:['cosa', 'lacrose']},
]

const CarouselBox = ({title, tag_id, searchValue}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [itemsInfo, setItemsInfo] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/get_items_by_tag?user=andy&tag=perrocosas")
          .then((response) => response.json())
          .then((res) => {
            console.log('in the card', res)
            setItemsInfo(res)
          });
      }, []);

    return (
        <div className={styles.container}>
            <h1>{title}</h1>
            <div className={styles.itemsContainer}>
                {itemsInfo && itemsInfo.map((item, index) => {
                    return (
                        <ItemCard 
                            key={index}
                            type="carousel"
                            content={item.content} 
                            rating={item.rating} 
                            // tags={item.tags}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default CarouselBox

