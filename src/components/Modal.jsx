import { useEffect } from 'react';
import css from '../Styles.module.css';

export const Modal = ({id, listImg, handlerClose})=>{
  useEffect(()=>{
    document.addEventListener('keydown',handlerClose);
    return ()=>document.removeEventListener('keydown',handlerClose); 
  },[handlerClose])
  return(
    <div className={css.Overlay} onClick={handlerClose}>
        <div className={css.Modal}>
            <img src={listImg.filter((el)=>el.id===id)[0].largeImageURL} alt="LargeImage" />
       </div>
    </div>
  )
}
