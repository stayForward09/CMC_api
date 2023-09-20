import requests
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
from CoinMarketCapSocket import CoinMarketCapSocket
import threading
import datetime
# import CoinCandles


class CoinsData:

    def getTop1000Coins(self):

        url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=1000&sort=cmc_rank'

        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': 'c5a8f525-820f-452b-80e4-f4c6281c2f68',
        }

        response = requests.get(url, headers=headers)

        response_dict = json.loads(response.text)

        coins_data = response_dict["data"]

        return coins_data

    def get(self):

        coins_data = self.getTop1000Coins()

        coins_data = CoinMarketCapSocket(
            coins_data).get_coins_volatility_data()
        return coins_data
