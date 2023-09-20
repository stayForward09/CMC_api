import json
from websockets.sync.client import connect
import time
import datetime
import requests
import os

class CoinMarketCapSocket:

    price_history = dict()

    def __init__(self, coins_data):   
        self.coins_data = coins_data
        self.coins_ids = [coin['id'] for coin in coins_data]
        self.websocket = connect("wss://push.coinmarketcap.com/ws")
        
            
    def _subscribe(self,start, end):

            payload = {
            "method":"RSUBSCRIPTION",
            "params":["main-site@crypto_price_15s@{}@detail",
                      ",".join(str(id) for id in self.coins_ids[start:end])
            ]}

            self.websocket.send(json.dumps(payload))
            message = self.websocket.recv()
            # print("Subscription Message:", message)

    def _unsubscribe(self):

            payload = {"method":"UN_SUBSCRIPTION_ALL"}
            self.websocket.send(json.dumps(payload))
            message = self.websocket.recv()
            message = json.loads(message)
            if 'd' in message.keys():
                record_time = datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M")
                for coin in self.coins_data:
                    if coin['id'] == message['d']['id']:
                        coin["volatility_data"] = message['d']
                        self._update_volatilty_data(coin)
                        self._record_coins_history(record_time, coin)

                # current message contains coin data, retrieve next message
                message = self.websocket.recv()
                # print("Unsubscription Message:", message)
            else:
                # print("Unsubscription Message:", message)
                pass
    
    def _update_volatilty_data(self,coin):
        # Calculate percent change of coin for 5', 15', 4Hr
        try:
            # if os.path.exists("./Backend/price_history.json"):
            #     with open("./Backend/price_history.json","r") as ph:
            #         price_history = json.loads(ph.read())
                    if coin["id"] in CoinMarketCapSocket.price_history.keys():

                        coin_history = CoinMarketCapSocket.price_history[coin["id"]]
                        past_five_min = datetime.datetime.fromisoformat(datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M")) - datetime.timedelta(minutes=5)
                        past_three_min = datetime.datetime.fromisoformat(datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M")) - datetime.timedelta(minutes=3)
                        past_fifteen_min = datetime.datetime.fromisoformat(datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M")) - datetime.timedelta(minutes=15)
                        past_four_hour = datetime.datetime.fromisoformat(datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M")) - datetime.timedelta(hours=4)
                        for record in coin_history:
                            record_time = datetime.datetime.fromisoformat(record["time"])
                            open_price = record["price"]
                            close_price = coin["volatility_data"]["p"]
                            if record_time > past_three_min:
                                coin["volatility_data"]["p3min"] = ((close_price - open_price)/open_price)*100
                                print("3MIN CHANGE:",coin["volatility_data"]["p3min"])

                            if record_time > past_five_min:
                                coin["volatility_data"]["p5m"] = ((close_price - open_price)/open_price)*100
                                print("5MIN CHANGE:",coin["volatility_data"]["p5m"])

                            if record_time > past_fifteen_min:
                                coin["volatility_data"]["p15m"] = ((close_price - open_price)/open_price)*100
                                print("15MIN CHANGE:",coin["volatility_data"]["p15m"])

                            if record_time > past_four_hour:
                                coin["volatility_data"]["p4h"] = ((close_price - open_price)/open_price)*100
                                print("4HOUR CHANGE:", coin["volatility_data"]["p4h"])
                    else:
                        print("")
                    
        except Exception as e:
            print("Error occurred while updating validity data:", str(e))
        

      
                

         

    def _record_coins_history(self,record_time, coin):
        price = coin["volatility_data"]["p"]
        coin_record = {"time":record_time,"price": price}
        if coin["id"] in CoinMarketCapSocket.price_history.keys():
            CoinMarketCapSocket.price_history[coin["id"]].append(coin_record)
        else:
            CoinMarketCapSocket.price_history[coin["id"]] = [coin_record]
                            
                        
        # Write record to json file
        with open("./Backend/price_history.json", "w") as ph:
            ph.write(json.dumps(CoinMarketCapSocket.price_history))

    def _receive(self,start, end):

        """
        Data of max. 199 coins can be retrieved from coinmarketcap webscoket at a time.
        """
        self._subscribe(start,end)
        for counter in range(start,end):

            message = self.websocket.recv()
            data = json.loads(message)
            if 'd' in data.keys():
                for coin in self.coins_data:
                    if coin['id'] == data['d']['id']:
                        coin["volatility_data"] = data['d']

                        if coin["id"] in CoinMarketCapSocket.price_history.keys():
                            previous_time = CoinMarketCapSocket.price_history[coin["id"]][-1]["time"]
                            record_time = datetime.datetime.fromisoformat(previous_time) + datetime.timedelta(minutes=1)
                            # print("Previous Time:",previous_time,"Record Time:", record_time)
                        else:
                            record_time = datetime.datetime.now()
                            # print("NEW TIME:",record_time)
                        
                        record_time = datetime.datetime.strftime(record_time,"%Y-%m-%d %H:%M")
                        coin['record_time'] = record_time
                        self._update_volatilty_data(coin)
                        self._record_coins_history(record_time, coin)

                
        
        self._unsubscribe()


    def get_coins_volatility_data(self):

        start_index = 0

        for end_index in range(200,len(self.coins_data) + 200,200):

            print("Start Index:", start_index, "End Index:", end_index)

            self._receive(start_index, end_index)
            
            start_index = end_index
        self.websocket.close_socket()
        return self.coins_data

