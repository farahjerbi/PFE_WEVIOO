import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface StyleState{
    isOpen: boolean;
}

const initialState: StyleState={
    isOpen:false
}

export const styleSlice = createSlice({
    name:"style",
    initialState,
    reducers:{
        setIsOpen:(
            state, 
            action : PayloadAction<StyleState>
            )=>{
            state.isOpen=action.payload.isOpen;
        },
      
    } 
})
export const selectIsOpen = (state: RootState) => state.style.isOpen;
export const {setIsOpen} = styleSlice.actions

export default styleSlice.reducer;