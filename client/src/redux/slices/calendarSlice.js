import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchCalendars = createAsyncThunk('calendars/fetchCalendars', async (calendarId, {rejectWithValue}) => {
    try {
        console.log(calendarId);
        if(typeof calendarId == 'string') {
            console.log(calendarId);
            var { data } = await axios.get(`/api/calendars/${calendarId}`);
        }
        else {
            var { data } = await axios.get(`/api/calendars/`);
        }

        console.log(data);
        
        return data;
    } 
    catch(error) {
        return rejectWithValue(error.response.data.error);
    } 
});

const initialState = {
    calendars: {
        items: [],
        error: null,
        status: 'loading'
    }
};

const calendarsSlice = createSlice({
    name: 'calendars',
    initialState,
    reducer: {},
    extraReducers: {
        //CALENDAR
        [fetchCalendars.pending]: (state) => {
            state.calendars.items = null;
            state.status = 'loading'
        },
        [fetchCalendars.fulfilled]: (state, action) => {
            state.calendars.items = action.payload;
            state.status = 'resolved';
        },
        [fetchCalendars.rejected]: (state, action) => {
            state.calendars.items = null;
            state.error = action.payload;
            state.status = 'rejected';
        },

    }
})

// export const selectIsAuth = (state) => Boolean(state.auth.userToken);
// export const selectIsAuthMe = (state) => Boolean(state.auth.userInfo);

export const calendarsReducer = calendarsSlice.reducer;