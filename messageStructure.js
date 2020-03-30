/*const request = require('request-promise');
const express = require('express');*/

/*Push
const push = (userId, msg, quickItem) => {
    return request.post({
        headers: LINE_HEADER,
        uri: `url for push`,
        body: JSON.stringify({
            to: userId,
            messages: [{
                type: "text",
                text: msg,
                quickReply: quickItem
            }]
        })
    })
};*/

/*Reply
const reply = (token, payload) => {
    return request.post({
        uri: `url for reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: token,
            messages: [payload]
        })
    })
};*/

/*broadcast Messages
const broadcast = (msg) => {
    return request.post({
        uri: `url for broadcast`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            messages: [{
                type: "text",
                text: msg
            }]
        })
    })
};*/