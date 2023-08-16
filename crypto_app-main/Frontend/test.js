const WebSocket = require("ws");
const URL = "wss://push.coinmarketcap.com/ws";

payload = {
  method: "RSUBSCRIPTION",
  params: ["main-site@crypto_price_5s@{}@normal", "1,"],
};
const ws = new WebSocket(URL);

ws.on("error", console.error);

ws.on("open", function open() {
  ws.send(JSON.stringify(payload));
});

ws.on("message", function message(data) {
  console.log("received: %s", data);
});
