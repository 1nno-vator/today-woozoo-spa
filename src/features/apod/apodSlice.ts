import axios from 'axios';
import moment from 'moment';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataProps {
    targetDate: string,
    isLoad: boolean,
    data: {
        copyright: string,
        date: string,
        explanation: string,
        hdurl: string,
        media_type: string | null,
        service_version: string | null,
        title: string | null,
        url: string
    }
}

let initialState:DataProps = {
    targetDate: moment(new Date()).format('YYYY-MM-DD'),
    isLoad: false,
    data: {
        copyright: "",
        date: "",
        explanation: "",
        hdurl: "",
        media_type: null,
        service_version: null,
        title: null,
        url: "https://cdn.newspenguin.com/news/photo/202009/3119_9104_2736.jpg"
    }
}

export const apodSlice = createSlice({
    name: 'apod',
    initialState: initialState,
    reducers: {
        ADD_DAY(state) {
            let nextDate = moment(state.targetDate).add(1, 'days').format('YYYY-MM-DD');
            state.targetDate = nextDate;
        },
        SUB_DAY(state) {
            let prevDate = moment(state.targetDate).subtract(1, 'days').format('YYYY-MM-DD');
            state.targetDate = prevDate;
        },
        LOAD_STATUS_TOGGLE(state, action: PayloadAction<boolean>) {
            state.isLoad = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FETCH_DATA.pending, (state) => {
                state.isLoad = false;
            })
            .addCase(FETCH_DATA.fulfilled, (state, action) => {
                
                if (action.payload && action.payload.media_type === 'image') {
                    state.data = action.payload;
                } else {
                    let prevDate = moment(state.targetDate).subtract(1, 'days').format('YYYY-MM-DD');
                    state.targetDate = prevDate;
                }
                
            })
    }
})

export let FETCH_DATA = createAsyncThunk('API/FETCH_DATA',async (_targetDate: string) => {
    
    const API_KEY = 'Iz75e0naUV7pTGptfpd3QCZZa9DKFdaR8P3JNPgc'

    return axios({
        method: "get",
        url: `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${_targetDate}`
    })
    .then(res => {
        return res.data;
    })
    .catch(() => {
        alert('데이터 조회에 실패하였습니다.');
    })

})

export let { ADD_DAY, SUB_DAY, LOAD_STATUS_TOGGLE } = apodSlice.actions;

export default apodSlice.reducer;