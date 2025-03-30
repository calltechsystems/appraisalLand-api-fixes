export const getPRODUCTIONUrl = () => {
    if(process.env.NODE_ENV == "development"){
        //when its on development Mode
        return process.env.BACKEND_DOMAIN2
    }
    else{
        //when its on Production Mode
        return process.env.BACKEND_DOMAIN2
    }
}