import { useCallback, useEffect, useReducer, useRef} from "react";
import { nanoid } from 'nanoid'
import { getImage } from "./Api";
import { ImageGallery } from "./ImageGallery";
import { createPortal } from 'react-dom';
import css from '../Styles.module.css';
import { Modal } from "./Modal";
import { Loader } from "./Loader";
import { Searchbar } from "./Searchbar";
import { LoadMore } from "./LoadMore";
const spinner = document.getElementById('spinner');
const modal = document.getElementById('modal');

function reducer(state, action) {
  // console.log(action)
  switch (Object.keys(action)[0]) {
    case 'query': 
      return {...state, ...{isQuery: action.query}, ...{objImg: []}, ...{page: 1}};
    case 'objImg': 
      return {...state, ...action.objImg, ...{objImg: [...state.objImg, ...action.objImg.objImg]}};
    case 'isModalOpen': 
      return {...state, ...{isModalOpen: action.isModalOpen}};
    case 'isLoading':
      return {...state, ...{isLoading: action.isLoading}};
    case 'error':
      return {...state, ...{error: action.error}};
    case 'page':
      return {...state, ...{page: action.page}};
    default: break;
      
  }
}
const initialState={
    objImg: [],
    isLoading: false,
    isModalOpen: 0,
    isQuery: '',
    error: null,
    page: 1,
    totalPage: 0,
    
}


export const App = ()=>{
  const [state, dispatch] = useReducer(reducer, initialState);
  const btn = useRef(null);
  const getImagePage = useCallback(()=>{
    try{
      getImage(state.isQuery, state.page)
      .then(({data})=>{
            const objImg = data.hits.map((el)=>({id: nanoid(), webformatURL: el.webformatURL, largeImageURL: el.largeImageURL}));
            dispatch({objImg: {objImg:[...objImg], totalPage: data.totalHits, isLoading: false}});
            
          });
    }catch(error){
      console.log(error);
      dispatch({error});
      
    }
  },[state.isQuery, state.page])
  
  useEffect(()=>{
    if(state.isQuery){
      dispatch({isLoading: true});
      getImagePage();
      btn.current?.removeAttribute('disabled');
    }

  },[state.isQuery, state.page, getImagePage]);

  function handleSubmit(query) {
    dispatch({ query });
  }
  const handlerOpenImg=(id)=>{
          dispatch({isModalOpen: id});
            
          }
  const handlerClose=(e)=>{
                if (e.target.nodeName==='DIV' || e.code==='Escape'){
                  dispatch({isModalOpen: 0});
                }
              }
  const handlerLoadMore=(e)=>{
                btn.current = e.target;              
                dispatch({page: state.page+1});
                dispatch({isLoading: true})
                btn.current.setAttribute('disabled','');
                btn.current.blur();

              }
  return(
    <>
      {state.isLoading && createPortal(<Loader/>, spinner)}
      {state.isModalOpen!==0  && createPortal(<Modal listImg={state.objImg} id={state.isModalOpen} handlerClose={handlerClose}/>, modal)}
      <div className={css.App}>
        <Searchbar handleSubmit={handleSubmit}/>
        <ImageGallery listImg={state.objImg} handlerOpenImg={handlerOpenImg}/>
        {state.objImg.length!==0 && (state.page * 12 <= state.totalPage) && <LoadMore LoadMore={handlerLoadMore}/>}  
        
      </div>
      
    </>
  )
}
