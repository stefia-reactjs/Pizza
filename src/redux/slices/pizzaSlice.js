import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPizzas = createAsyncThunk('pizza/fetchPizzasStatus', async (params) => {
  const { category, search, currentPage, sort } = params
  const { data } = await axios.get(
    `https://dc5d486244a8185f.mokky.dev/items?page=${currentPage}&limit=4&${category}&sortBy=${sort.sortProperty}${search}`,
  )
  return data
})

const initialState = {
  items: [],
  status: 'loading',
}

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = 'loading'
        state.items = []
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.status = 'success'
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = 'error'
        state.items = []
      })
  },
})
export const selectPizzaData = (state) => state.pizza

export const { setItems } = pizzaSlice.actions
export default pizzaSlice.reducer
