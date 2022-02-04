#!/usr/bin/nodejs

var WebSocket = require('ws');
var fs = require('fs');

let outVideo;
let ws;
const videoLength = 1800 * 1000; // 30min

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

async function record() {
    while (true) {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let dateString = year + "-" + month + "-" + date + "_" + hours + "-" + minutes + "-" + seconds;
        let fileName = "renee-" + dateString + ".mp4";

        console.log("recording start at " + dateString);

        outVideo = fs.createWriteStream("/src/renee/video/" + fileName);
        ws = new WebSocket('ws://path/to/ws/video/stream');

        ws.on('message', function(data, flags) {
            outVideo.write(data, "binary");
        });

        await wait(videoLength);
        ws.terminate();
        outVideo.end();
    }
}

record();

process.on('SIGINT', function() {
    console.log("End recording");
    ws.terminate();
    outVideo.end();
    process.exit();
});
