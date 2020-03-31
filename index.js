const functions = require('firebase-functions');
const request = require('request-promise');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

const region = 'asia-east2';
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/';
const LINE_HEADER = {
    'Content-type': 'application/json',
    'Authorization': 'Bearer LQmKuyzWyTLIFAXz0eOs10NVqzj7WVRp+TsxVYw+xftTsyy4uE7knr1kUdij1eQs/c1TequRE6VcVNq4Y9WpAAbsoAipEIcq/IIWDOnCSN57HYFyf7WtQg921IRiWdaQL7QmyI0z9MqXgsaPPQycUQdB04t89/1O/w1cDnyilFU='
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://line-bot-ggmirx.firebaseio.com'
});

const db = admin.firestore();

exports.LineBot = functions.region(region).https.onRequest((req, res) => {
    let event = req.body.events[0];
    if (event.message.type !== 'text') {
        return;
    }
    else if (event.message.type === "text" && event.message.text === "Products"){
        reply(event.replyToken, {
            type: "template",   
            altText: "this is a buttons template",
            template: {
              type: "buttons",
              thumbnailImageUrl: "https://www.happeningandfriends.com/uploads/happening/stores/1/55/image_thumb/-+%C2%A6-%C3%AD++-+8%2010%20-++++a-%C2%A6+%20logo.jpg",
              title: "The Layers Store",
              text: "Click me",
              actions: [
                {
                  type: "uri",
                  label: "SHOP",
                  uri: "https://10millimetres.page365.net/"
                }
              ]
            }
          });
    }else if (event.message.type === "text" && event.message.text === "Events"){
        const eventExist = db.collection("upcomingEvent").where('eventstatus','==', true).get()
        .then( returnDatas => {
            let itemArray = [];
            if (returnDatas.empty){
                return reply(event.replyToken, {
                    type: 'text',
                    text: 'ขออภัย ไม่มี event ในขณะนี้'
                })
            };
                returnDatas.forEach(returnData => {
                    itemArray.push({
                        imageUrl: returnData.data().picUri,
                        action: {
                            type: "uri",
                            label: returnData.data().name,
                            uri: returnData.data().uri
                        }
                    })
                });
                
                reply(event.replyToken, {
                    type: 'template',
                    altText: 'Event carousel template show',
                    template: {
                        type: 'image_carousel',
                        columns: itemArray
                    }
                })

            return null;
        }).catch(err => {
            console.log(err)
        })
       
    }else if (event.message.type === "text" && event.message.text === "Location"){
        reply(event.replyToken, {
            type: 'location',
            title: 'The Layers pop-store',
            address: '44 ซอย โชคชัยร่วมมิตร แขวง ดินแดง เขตดินแดง กรุงเทพมหานคร 10400',
            latitude: '13.8000978',
            longitude: '100.5734106'
        })
    }
    else(
        reply(event.replyToken, {
            type: 'text',
            text: 'Thelayers ยินดีต้อนรับค่ะ',
            quickReply: {
                items: [
                    {
                        "type": "text",
                        "imageUrl": "https://cdn3.iconfinder.com/data/icons/unigrid-phantom-finance-vol-3/60/014_149_price_tag_finance_product_info_details-512.png",
                        "action": {
                            "type": "message",
                            "label": "ดูสินค้า",
                            "text": "Products"
                        },
                    },
                    {
                        "type": "text",
                        "imageUrl": "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/art-512.png",
                        "action": {
                            "type": "message",
                            "label": "กิจกรรม",
                            "text": "Events"
                        }
                    },
                    {
                        "type": "text",
                        "imageUrl": "https://cdn4.iconfinder.com/data/icons/office-and-business-conceptual-flat/178/13-512.png",
                        "action": {
                            "type": "message",
                            "label": "แผนที่ร้าน",
                            "text": "Location"
                        }
                    }
                ]
            }
        })
    );
});

//REPLY MESSAGE
const reply = (token, payload) => {
    return request.post({
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: token,
            messages: [payload]
        })
    })
};
