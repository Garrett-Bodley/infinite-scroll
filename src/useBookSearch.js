import { useState, useEffect } from 'react'

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => setBooks([]), [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    const controller = new AbortController()
    fetch(`http://openlibrary.org/search.json?q=${query}&page=${pageNumber}`, {signal: controller.signal})
      .then(resp => resp.json())
      .then(json => {
        setBooks(prevBooks => [...new Set([...prevBooks, ...json.docs.map(book => book.title)])])
        setHasMore(json.docs.length > 0)
        setLoading(false)
      }).catch(e => {
        if(e.name === "AbortError") return
        setError(true)
      })
    return () => controller.abort()
  }, [query, pageNumber])

  return { loading, error, books, hasMore }
}

export default useBookSearch
