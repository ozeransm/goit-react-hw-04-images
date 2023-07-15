import { useState } from 'react';
import css from '../Styles.module.css';
export const Searchbar = ({handleSubmit})=>{
    const [isQuery, setisQuery] = useState('');

    const onSubmit=(e)=>{
        e.preventDefault();
        handleSubmit(isQuery)            
    }
    const onChange=(e)=>{
        setisQuery(e.target.value);
    }
    const onFocus=()=>{
        setisQuery('');
    }
    return(
        
        <header className={css.Searchbar}>
        <form className={css.SearchForm} onSubmit={onSubmit}>
            <button type="submit" className={css["SearchForm-button"]} >
            <span className={css["SearchForm-button-label"]}>Search</span>
            </button>

            <input
            className={css["SearchForm-input"]}
            type="text"
            name="searchQuery"
            value={isQuery}
            onChange={onChange}
            onFocus={onFocus}
            placeholder="Search images and photos"
            />
        </form>
        </header>
        
    )
}
