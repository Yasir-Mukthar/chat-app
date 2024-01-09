

const generateMessage = ( username,text) => {
    return {
        username,
        
        text,
        createdAt: new Date().getTime()
    }
}
const generateLocation=(username,url)=>{
    return{
        username,
        url:url,
        createdAt:new Date().getTime()
    }
}

//export generateMesssage
module.exports = {
    generateMessage,
    generateLocation
}

