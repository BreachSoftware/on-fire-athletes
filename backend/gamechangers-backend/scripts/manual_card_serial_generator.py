import boto3
import requests

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb')

# Specify the table name
table_name = 'GamechangersSerialCards'

# Make the API request
response = requests.get("https://5lii8dnt7k.execute-api.us-east-1.amazonaws.com/getAllCards")
data = response.json()

# Sort the cards by the "createdAt" Unix timestamp in descending order
sorted_cards = sorted(data, key=lambda card: card["createdAt"], reverse=True)

# Check each card's UUID
for card in sorted_cards:
	uuid = card["uuid"]
	# Check if the card is already in the DynamoDB table
	response = dynamodb.get_item(TableName=table_name, Key={"uuid": {"S": uuid}, "serialNumber": {"N": "1"}})
	if "Item" not in response:
		# Get the amount of cards created
		generatedBy = card["generatedBy"]
		totalCards = card["totalCreated"]
		
		# Create serialized cards based on the amount of cards created
		for i in range(totalCards):
			# Add the card to the DynamoDB table
			requests.post("https://33lh6t4m97.execute-api.us-east-1.amazonaws.com/createSerializedCard", json={"uuid": uuid, "generatedBy": generatedBy, "serialNumber": i + 1})
	else:
		print(f"Card with UUID {uuid} already exists in the serialized DynamoDB table.")

# Print a message indicating the completion of the script
print("Script completed successfully.")
		
