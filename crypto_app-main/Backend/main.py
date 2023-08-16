from flask import Flask
from CoinsData import CoinsData
from flask_cors import CORS
import json
import threading
import CoinCandles
import schedule
import time
import os
app = Flask(__name__)
CORS(app)


@app.route("/data", methods=['GET'])
def getPercentageChangeUpdate():

    coins_f = open("./Backend/coins_data.json", "r")
    volume_data = open("./Backend/volume_change.json", "r")
    candle_f = open("./Backend/candles_data.json", "r")
    coins_data = json.loads(coins_f.read())
    volume_data_json = json.loads(volume_data.read())
    candle_datas = json.loads(candle_f.read())
    merged_data = [{**c, **d, **v} for c, d, v in zip(coins_data, candle_datas, volume_data_json)]
    return json.dumps(merged_data)

@app.route("/volume", methods=['GET'])
def getVolumeChange():
    if os.path.exists('./Backend/volume_change.json'):

        with open('./Backend/volume_change.json', 'r') as file:
            volume_data = file.read()
        return volume_data
    else:
        return " "

@app.route("/candle", methods=['GET'])
def getCandleCount():
    if os.path.exists('./Backend/volume_change.json'):

        with open('./Backend/volume_change.json', 'r') as file:
            volume_data = file.read()
        return volume_data
    else:
        return " "


schedule.every().hour.do(CoinCandles.getVolume)
schedule.every().day.do(CoinCandles.generateCandleCounts)
def scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

def schedule_coins_data_scraping():
    while True:
        coins_data = json.dumps(CoinsData().get())
        with open("./Backend/coins_data.json", "w") as out:
            out.write(coins_data)


if __name__ == "__main__":
    
    threading.Thread(target=CoinCandles.generateCandleCounts).start()
    threading.Thread(target=scheduler).start()
    threading.Thread(target=CoinCandles.getVolume).start()
    threading.Thread(target=app.run).start()
    schedule_coins_data_scraping()
    
