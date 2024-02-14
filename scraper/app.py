from flask import Flask, request
from recipe_scrapers import scrape_me
from flask_caching import Cache
import os

config = {
  "DEBUG": False,
  "CACHE_TYPE": "RedisCache",
  "CACHE_DEFAULT_TIMEOUT": 300,
  "CACHE_REDIS_HOST": os.environ["CACHE_REDIS_HOST"],
  "CACHE_REDIS_PORT": os.environ["CACHE_REDIS_PORT"],
  "CACHE_REDIS_DB": os.environ["CACHE_REDIS_DB"],
  "CACHE_REDIS_URL": os.environ["CACHE_REDIS_URL"],
  "CACHE_KEY_PREFIX": os.environ["CACHE_KEY_PREFIX"],
}
app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

@app.route("/", methods=["GET"])
@cache.cached(timeout=30, query_string=True)
def scrape_route():
  url = request.args.get("url")
  try:
    data = scrape_me(url)
    return data.to_json()
  except Exception as e1:
    app.logger.error(str(e1))
    try:
      data = scrape_me(url, wild_mode=True)
      return data.to_json()
    except Exception as e2:
      app.logger.error(str(e2))
      return (getattr(e2, 'message', str(e2)), 500)
