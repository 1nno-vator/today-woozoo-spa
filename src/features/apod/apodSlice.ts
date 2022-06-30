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
        url: string,
        translate_title: string | null,
        translate_explanation: string | null
    },
    errCount: number,
    minDate: string,
    maxDate: string
}

let initialState:DataProps = {
    targetDate: moment(new Date()).utc().format('YYYY-MM-DD'),
    isLoad: false,
    data: {
        copyright: "",
        date: "",
        explanation: "",
        hdurl: "",
        media_type: null,
        service_version: null,
        title: null,
        url: "https://cdn.newspenguin.com/news/photo/202009/3119_9104_2736.jpg",
        translate_title: null,
        translate_explanation: null
    },
    errCount: 0,
    minDate: '1995-06-16',
    maxDate: moment(new Date()).utc().add(1, 'days').format('YYYY-MM-DD')
}

export const apodSlice = createSlice({
    name: 'apod',
    initialState: initialState,
    reducers: {
        ADD_DAY(state) {
            let nextDate = moment(state.targetDate).add(1, 'days').format('YYYY-MM-DD');
            if (moment(nextDate).isBefore(state.maxDate)) {
                state.targetDate = nextDate;
            }
        },
        SUB_DAY(state) {
            let prevDate = moment(state.targetDate).subtract(1, 'days').format('YYYY-MM-DD');
            if (moment(prevDate).isAfter(state.minDate)) {
                state.targetDate = prevDate;
            }
        },
        LOAD_STATUS_TOGGLE(state, action: PayloadAction<boolean>) {
            state.isLoad = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FETCH_DATA.pending, (state) => {
                state.data = initialState.data;
                state.isLoad = false;
            })
            .addCase(FETCH_DATA.fulfilled, (state, action) => {

                if (action.payload && action.payload.media_type === 'image') {
                    state.data = action.payload;
                } else {
                    
                    if (state.errCount++ <= 5) { // 오류로 인한 무제한 요청 방지
                        let prevDate = moment(state.targetDate).subtract(1, 'days').format('YYYY-MM-DD');
                        state.targetDate = prevDate;
                    }
                    
                }
                
            })
    }
})

export let FETCH_DATA = createAsyncThunk('API/FETCH_DATA',async (_targetDate: string) => {
    console.log(`http://localhost:3500/${_targetDate}`);
    return axios({
        method: "get",
        url: `http://localhost:3500/${_targetDate}`
    })
    .then(res => {
        return res.data
    })
    .catch(() => {
        console.log('데이터 조회에 실패하였습니다.');
    })

})

export let { ADD_DAY, SUB_DAY, LOAD_STATUS_TOGGLE } = apodSlice.actions;

export default apodSlice.reducer;