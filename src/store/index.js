import { configureStore, createSlice } from "@reduxjs/toolkit";

const weatherReducer = createSlice({
    name: 'weatherStore',
    initialState: {
        loading: true,
        weather: {},
        unit: 'F'
    },
    reducers: {
        completeLoading(state) {
            state.loading = false
        },
        setWeather(state, action) {
            state.weather = action.payload
        },
        setUnit(state, action) {
            state.unit = action.payload
        }
    }
})

const store = configureStore({
    reducer: weatherReducer.reducer
})


export const weatherActions = weatherReducer.actions;
export default store;