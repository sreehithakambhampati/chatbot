const msgInput = document.querySelector(".message-input")
const sendMsgButton = document.querySelector("#send-message")
const chatBody = document.querySelector(".chat-body")
const fileInput = document.querySelector("#file-input")
const fileUploadWrapper = document.querySelector(".file-upload-wrapper")
const fileCancelButton = document.querySelector("#file-cancel")
const chatBotToggler = document.querySelector("#chatbot-toggler")
const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }

};
const chatHistory = []
const initialInputHeight = msgInput.scrollHeight;
const API_KEY = "AIzaSyAvUoiN5skRhYB4_wcmuQPmjVslVQ2W2ac";
const API_url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const generateBotResponse = async (inComingmsgDiv) => {
    const msgElement = inComingmsgDiv.querySelector(".message-text")

    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
    });
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }
    try {
        const response = await fetch(API_url, requestOptions)
        const data = await response.json();
        if (!response.ok)
            throw new Error(data.err.message);
        const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        // msgElement.innerText = apiResponse
        const wrapper = document.createElement("div");
        wrapper.classList.add("response-wrapper");

        const textDiv = document.createElement("div");
        textDiv.classList.add("response-text");
        textDiv.innerText = apiResponse;

        const copyContainer = document.createElement("button");
        copyContainer.classList.add("copy-container");

        const iconSpan = document.createElement("span");
        iconSpan.classList.add("material-symbols-rounded");
        iconSpan.innerText = "content_copy";

        const copyLabel = document.createElement("span");
        copyLabel.innerText = "Copy";

        copyContainer.appendChild(iconSpan);
        copyContainer.appendChild(copyLabel);

        copyContainer.addEventListener("click",()=>{
            navigator.clipboard.writeText(apiResponse);
            iconSpan.innerText = "check";
            copyLabel.innerText = "Copied!";
            setTimeout(()=>{
                iconSpan.innerText = "content_copy";
                copyLabel.innerText = "Copy";
            },1000);
        })

        wrapper.appendChild(textDiv);
        wrapper.appendChild(copyContainer);
        msgElement.replaceWith(wrapper);
        //Adding bot response to chat history
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponse }]
        });
    }
    catch (error) {

        msgElement.innerText = error.message
        msgElement.style.color = "#ff0000"

    } finally {

        userData.file = {}
        inComingmsgDiv.classList.remove("thinking")
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })
    }
}
const handleOutgoingMsg = (e) => {
    e.preventDefault();
    userData.message = msgInput.value.trim();
    fileUploadWrapper.classList.remove("file-uploaded")
    msgInput.dispatchEvent(new Event("input"));
    msgInput.value = "";
    msgInput.style.height = `${initialInputHeight}px`;
document.querySelector(".chat-form").style.borderRadius = "32px";
    const msgContent = ` 
    <div class="message-text"></div> 
    ${userData.file.data ?
            `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
            : ""}`;

    const outGoingmsgDiv = createMsgElement(msgContent, "user-message")
    outGoingmsgDiv.querySelector(".message-text").innerText = userData.message
    chatBody.append(outGoingmsgDiv)
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })
    setTimeout(() => {
        const msgContent = ` <svg class="bot-avatar" 
                 xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path
                        d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z">
                    </path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`
        const inComingmsgDiv = createMsgElement(msgContent, "bot-message", "thinking")
        chatBody.append(inComingmsgDiv)
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })
        generateBotResponse(inComingmsgDiv)
    }, 600)

}
const createMsgElement = (msgContent, ...classes) => {
    const div = document.createElement("div")
    div.classList.add("message", ...classes)
    div.innerHTML = msgContent
    return div
}
msgInput.addEventListener("keydown", (e) => {
    const userMsg = e.target.value
    if (e.key === "Enter" && userMsg && !e.shiftKey) {
        handleOutgoingMsg(e);

    }
})
msgInput.addEventListener("input", () => {
    
    msgInput.style.height = `${msgInput.scrollHeight}px`
    document.querySelector(".chat-form").style.borderRadius = msgInput.scrollHeight > initialInputHeight ? "15px" : "32px";


})
sendMsgButton.addEventListener("click", (e) => {
    handleOutgoingMsg(e)
})

document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file)
        return;

    const reader = new FileReader()
    reader.onload = (e) => {

        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded")
        const base64String = e.target.result.split(",")[1];
        userData.file = {
            data: base64String,
            mime_type: file.type
        }
        fileInput.value = "";
    }
    reader.readAsDataURL(file)

})

fileCancelButton.addEventListener("click", () => {
    fileUploadWrapper.classList.remove("file-uploaded")
    userData.file = {}
})




// https://github.com/missive/emoji-mart 
const picker = new EmojiMart.Picker({
    theme: "light",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = msgInput;

        msgInput.setRangeText(emoji.native, start, end, "end");
        msgInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker")
        }
        else {
            document.body.classList.remove("show-emoji-picker")
        }
    }

})

document.querySelector(".chat-form").appendChild(picker)
chatBotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot")
})

