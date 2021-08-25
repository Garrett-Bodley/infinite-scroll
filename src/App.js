import './App.css';
import { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

function App() {

  const [query, setQuery] = useState("")
  const [pageNum, setPageNum] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNum)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if(loading) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) setPageNum(prevPageNum => prevPageNum + 1)
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setPageNum(1)
  }

  return (
    <div className="App">
      <input type="text" value={query} onChange={handleQueryChange}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else {
        return <div key={book}>{book}</div>
        }
      })}
      <div>{ loading && 'Loading...' }</div>
      <div>{ error && 'Error' }</div>
    </div>
  );
}

export default App;
