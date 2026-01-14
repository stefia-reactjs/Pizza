import { useContext, useEffect, useState } from 'react'

import axios from 'axios'
import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../components/Pagination'
import { SearchContext } from '../App'
import { useSelector, useDispatch } from 'react-redux'

import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice'
function Home() {
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const { searchValue } = useContext(SearchContext)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }
  const onChangePage = (number) => {
    dispatch(setCurrentPage(number))
  }
  useEffect(() => {
    setIsLoading(true)

    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `search=${searchValue}` : ''

    axios
      .get(
        `https://dc5d486244a8185f.mokky.dev/items?page=${currentPage}&limit=4&${category}&sortBy=${sort.sortProperty}${search}`,
      )
      .then((res) => {
        setItems(res.data.items)
        setIsLoading(false)
      })

    window.scrollTo(0, 0)
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />)
  const pizzas = items
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true
      }
      return false
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />)
  return (
    <>
      <div className="container">
        <div className="content__top">
          <Categories value={categoryId} onChangeCategory={onChangeCategory} />
          <Sort />
        </div>
        <h2 className="content__title">Все пиццы</h2>
        <div className="content__items">{isLoading ? skeletons : pizzas}</div>
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  )
}

export default Home
