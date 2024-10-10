import requests
import webbrowser
import time

# Make the API request
response = requests.get("https://5lii8dnt7k.execute-api.us-east-1.amazonaws.com/getAllCards")
data = response.json()

# Sort the cards by the "createdAt" Unix timestamp in descending order
sorted_cards = sorted(data, key=lambda card: card["createdAt"], reverse=True)

# Ask for user input
num_cards = int(input("How many of the most recent cards would you like to generate an asset for? "))

# Iterate over the specified number of most recent cards
for card in sorted_cards[:num_cards]:
    uuid = card["uuid"]
    generated_by = card["generatedBy"]
    
    # Construct the URL for the trading card
    url = f"https://on-fire-athletes.netlify.app/generate_card_asset?generatedBy={generated_by}&uuid={uuid}"
    
    # Open the URL in the default browser
    webbrowser.open(url)

    time.sleep(10)