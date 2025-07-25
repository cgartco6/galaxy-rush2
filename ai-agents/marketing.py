import tweepy
import openai
from datetime import datetime

openai.api_key = "YOUR_OPENAI_KEY"
TWITTER_KEYS = {
    'consumer_key': 'YOUR_KEY',
    'consumer_secret': 'YOUR_SECRET',
    'access_token': 'YOUR_TOKEN',
    'access_token_secret': 'YOUR_TOKEN_SECRET'
}

def generate_daily_content():
    # Generate content using AI
    prompt = "Create social media post about Galaxy Rush crypto tournament game"
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150
    )
    
    content = response.choices[0].text.strip()
    
    # Post to Twitter
    auth = tweepy.OAuthHandler(TWITTER_KEYS['consumer_key'], TWITTER_KEYS['consumer_secret'])
    auth.set_access_token(TWITTER_KEYS['access_token'], TWITTER_KEYS['access_token_secret'])
    api = tweepy.API(auth)
    
    api.update_status(f"{content}\n\n{datetime.now().strftime('%Y-%m-%d')}\n#GalaxyRush #CryptoGaming")
    print("Posted daily content to Twitter")

if __name__ == "__main__":
    generate_daily_content()
