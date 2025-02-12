const msgInput = document.querySelector(".message-input")
const sendMsgButton = document.querySelector("#send-message")
const chatBody = document.querySelector(".chat-body")
const userData ={
    message : null
}
const handleOutgoingMsg=(e)=>{
    e.preventDefault();
    userData.message = msgInput.value.trim();
    //clearing the text area after msg is sent
    msgInput.value = "";
    const msgContent = ` <div class="message-text">
                </div>`
    const msgDiv = createMsgElement(msgContent,"user-message")
    msgDiv.querySelector(".message-text").innerText = userData.message
    chatBody.append(msgDiv)

}
const createMsgElement =(msgContent,classes)=>{
    const div = document.createElement("div")
    div.classList.add("message",classes)
    div.innerHTML = msgContent
    return div
}
msgInput.addEventListener("keydown",(e)=>{
    const userMsg = e.target.value
    if(e.key==="Enter" && userMsg)
    {
        handleOutgoingMsg(e);

    }
})
sendMsgButton.addEventListener("click",(e)=>{
    handleOutgoingMsg(e)
})

