from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import os
import requests
import json
import base64

load_dotenv()

@csrf_exempt
def call_fatsecret_api(request):
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
        
    if request.method == "POST":
        try:
            # Get API credentials from environment
            # api_key = os.getenv('FATSECRET_API_KEY')
            # api_secret = os.getenv('FATSECRET_API_SECRET')
            
            # Get image from request
            image_file = request.FILES.get('image')
            if not image_file:
                return JsonResponse({'error': 'No image provided'}, status=400)
            
            # Convert image to base64
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Prepare request payload
            payload = {
                "image_b64": image_data,
                "region": "US",
                "language": "en",
                "include_food_data": True
            }
            
            # Set up headers with OAuth2 token
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}'
            }
            
            # Make request to FatSecret API
            response = requests.post(
                "https://platform.fatsecret.com/rest/image-recognition/v1",
                headers=headers,
                json=payload
            )
            
            # Return API response
            return JsonResponse(response.json())
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)