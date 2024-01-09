

const socket =io();

// Elements
const $messageForm = document.querySelector("#message-submit");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $shareLocationButton = document.querySelector("#share-location");
const $messages = document.querySelector("#messages");
// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate=document.querySelector("#location-template").innerHTML;
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;

// Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoScroll=()=>{
    // New message element
    const $newMessage=$messages.lastElementChild

    // Height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    // Visible Height
    const visibleHeight=$messages.offsetHeight

    // Height of messages container
    const containerHeight=$messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}



socket.on("message",(message)=>{
    
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoScroll();


})

socket.on("locationMessage",(message)=>{
    const html=Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoScroll();
})


document.querySelector("#message-submit").addEventListener("submit",(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute("disabled","disabled");
    const message = e.target.elements.message.value;
    socket.emit("sendMessage",message,(error)=>{

        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value="";
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        // Clear input

        console.log("Message Delivered ");
    });
})

//list to roomData event
socket.on("roomData",({room,users})=>{

    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML=html

})

// share location
document.querySelector("#share-location").addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        $shareLocationButton.setAttribute("disabled","disabled")

        socket.emit("shareLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, ()=>{
            console.log("Location Shared");
            $shareLocationButton.removeAttribute("disabled")
        })
    })
})

socket.emit("join",{username,room},(error)=>{

    if(error){
        alert(error)
        location.href="/"
    }
})






// socket.on("countUpdated",(count)=>{
//     console.log("The count has been updated",count);  
// })
// document.querySelector("#increment").addEventListener("click",()=>{
//     console.log("Clicked");
//     socket.emit("increment");
// })

