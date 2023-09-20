import datetime
import requests
import json
from CoinsData import CoinsData


def getCount(coin_id):

    try:

        

        current_date = datetime.datetime.now().date()

        previous_7th_date = current_date - datetime.timedelta(days=7)

        previous_14th_date = current_date - datetime.timedelta(days=14)

        previous_7th_date_time_stamp = int(datetime.datetime.fromisoformat(
            previous_7th_date.isoformat()).timestamp())

        previous_14th_date_time_stamp = int(datetime.datetime.fromisoformat(
            previous_14th_date.isoformat()).timestamp())

        candles_count_7 = _calculateCandlesCount(_getCandlesHistory(
            coin_id, previous_7th_date_time_stamp), previous_7th_date)

        candles_count_14 = _calculateCandlesCount(_getCandlesHistory(
            coin_id, previous_14th_date_time_stamp), previous_14th_date)
    
    except Exception as e:

        print("Error Ocurred:", str(e))
        return 0,0


    return candles_count_7, candles_count_14


def _calculateCandlesCount(candles, previous_date):

    filtered_candles_count = 0

    if candles != None:

        for candle in candles:

            try:
                candle_quote = candle["quote"]
                candle_date = datetime.datetime.fromisoformat(
                    candle_quote["timestamp"]).date()
                if candle_date >= previous_date:
                    open = candle_quote["open"]
                    close = candle_quote["close"]
                    change = ((close - open)/open)*100

                    if change > 4.0 or change < -4.0:
                        filtered_candles_count += 1
            except Exception as e:

                print("Error Occurred:", str(e))

    return filtered_candles_count


def _getCandlesHistory(coin_id, timestamp):

    try:

        CANDLES_HISTORY_URL = f"https://api.coinmarketcap.com/data-api/v3.1/cryptocurrency/historical?id={coin_id}&timeStart={timestamp}&interval=1h"

        candles_history_response = requests.get(CANDLES_HISTORY_URL)

        candles = json.loads(candles_history_response.text)["data"]["quotes"]
    except Exception as e:
        print("Error Occurred:", str(e))
        return None

    return candles

def generateCandleCounts():
    
    
    coins_data = CoinsData().getTop1000Coins()
    data = []
    # Retrieving 7 and 14 days Candles Counts for coins
    for coin in coins_data:
        candle_count_7, candle_count_14 = getCount(coin["id"])

        data.append({"id": coin["id"], "name": coin["name"],
                    "candle_count_7": candle_count_7, "candle_count_14": candle_count_14})

        with open("./Backend/candles_data.json", "w") as out:
            out.write(json.dumps(data))
    
        

def getVolume():
    volume_data = []
    coins_data = CoinsData().getTop1000Coins()
    counter = 0
    for coin in coins_data:
        
        current_date = datetime.datetime.now()
        previous_2_date = current_date - datetime.timedelta(days=2)
        previous_2_date_time_stamp = int(datetime.datetime.fromisoformat(
            previous_2_date.isoformat()).timestamp())
        candles = _getCandlesHistory(coin['id'], previous_2_date_time_stamp)
        volumes_list = []

        if candles != None:
            
            for candle in candles:
                candle_quote = candle["quote"]
                candle_date = datetime.datetime.fromisoformat(
                candle_quote["timestamp"]).timestamp()
                if candle_date >= previous_2_date_time_stamp:
                    volumes_list.append(candle['quote']['volume'])

            try:
                average_volume = (volumes_list[-1] -
                                sum(volumes_list)/len(volumes_list))/volumes_list[-1]
                

                volume_data.append({
                    'id': coin['id'],
                    "volume_record": average_volume
                })
            except Exception as e:
                # print("Coin ID:", coin["id"])
                # print("Coin#", counter)
                # print("Volumes List:", volumes_list)
                # print("Error Occurred:", str(e))
                pass
        



            counter += 1
    with open('./Backend/volume_change.json', 'w') as f:
        f.write(json.dumps(volume_data))
