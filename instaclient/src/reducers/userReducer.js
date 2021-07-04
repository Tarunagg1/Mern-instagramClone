import { USER,LOGOUT, UPDATE } from "./constant";

export const initialState = null;

export const reducer = (state=initialState,action) =>{
    const {type,payload} = action;
    if(type === USER){
        return payload
    }else if(type === LOGOUT){
        return null
    }
    else if(type === UPDATE){
        return {
            ...state,
            followers:payload.followers,
            following:payload.following
        }
    }
    return state;
}