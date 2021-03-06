const request = require("request");
const gm = require("gm").subClass({
  imageMagick: true
});

exports.run = async (client, message, args) => { // eslint-disable-line no-unused-vars
  // get list of messages in channel
  const messageList = message.channel.messages.sort(function(a, b) {
    return b.createdTimestamp - a.createdTimestamp;
  }).array();
  let attachmentFound = false;
  for (let i = 0; i < messageList.length; i++) {
    if (messageList[i].attachments.array().length !== 0) {
      message.channel.startTyping();
      const attachmentsList = messageList[i].attachments.array();
      const fileExtension = attachmentsList[0].file.name.split(".").slice(-1)[0].toLowerCase();
      // check if file is an image or not
      if (fileExtension !== "png" && fileExtension !== "jpg" && fileExtension !== "jpeg") {
        message.channel.stopTyping();
        return message.reply("you need to upload a PNG or JPG file to add more JPEG!");
      }
      gm(request(attachmentsList[0].url)).setFormat("jpg").quality(1).stream((error, stdout) => {
        if (error) throw new Error(error);
        message.channel.stopTyping();
        message.channel.send({
          files: [{
            attachment: stdout,
            name: "morejpeg.jpg"
          }]
        });
      });
      attachmentFound = true;
      break;
    }
  }
  if (!attachmentFound) {
    return message.reply("you need to upload a PNG or JPG file to add more JPEG!");
  }
};
