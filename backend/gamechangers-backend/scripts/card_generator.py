import boto3
import webbrowser
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb')

# Specify the table name
table_name = 'GamechangersCards'

# Get the current timestamp as the last processed timestamp
last_processed_timestamp = int(time.time())

# Initialize the timestamp for logging "No new items found" message
last_no_items_log_timestamp = 0

# Initialize the timestamp of the last new item found
last_new_item_timestamp = None

logging.info('Script started. Last processed timestamp: %s', last_processed_timestamp)

while True:
    try:
        # Scan the DynamoDB table to get all items
        response = dynamodb.scan(TableName=table_name)
        items = response['Items']

        # Sort the items by the "createdAt" attribute in descending order
        sorted_items = sorted(items, key=lambda item: int(item['createdAt']['N']), reverse=True)

        # Check if there are any new items
        new_items = [item for item in sorted_items if int(item['createdAt']['N']) > last_processed_timestamp]

        if new_items:
            logging.info('Found %s new item(s)', len(new_items))

            # Process each new item
            for item in new_items:
                # Extract the necessary attributes from the item
                uuid = item['uuid']['S']
                generated_by = item['generatedBy']['S']

                # Construct the URL for the trading card
                url = f"https://gamechangers.zenithsoftware.dev/generate_card_asset?generatedBy={generated_by}&uuid={uuid}"

                # Open the URL in the default browser
                webbrowser.open(url)

                logging.info('Opened URL: %s', url)

                # Wait for 1 second before processing the next item
                time.sleep(1)

            # Update the last processed timestamp to the timestamp of the most recent item
            last_processed_timestamp = int(new_items[0]['createdAt']['N'])
            logging.info('Updated last processed timestamp: %s', last_processed_timestamp)

            # Update the timestamp of the last new item found
            last_new_item_timestamp = datetime.fromtimestamp(last_processed_timestamp)
        else:
            current_timestamp = int(time.time())
            if current_timestamp - last_no_items_log_timestamp >= 600:  # 600 seconds = 10 minutes
                if last_new_item_timestamp:
                    logging.info('No new items found. Last new item found at: %s', last_new_item_timestamp)
                else:
                    logging.info('No new items found. No new items have been found yet.')
                last_no_items_log_timestamp = current_timestamp

        # Wait for 1 second before the next iteration
        time.sleep(1)
    except Exception as e:
        logging.error('An error occurred: %s', e)
        time.sleep(1)