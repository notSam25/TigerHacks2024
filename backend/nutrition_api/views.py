from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()

@csrf_exempt
def NutritionFacts(request):
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"  # Added http:// prefix
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "POST":
        try:
            api_key = os.getenv('FOOD_VISOR_API')
            if not api_key:
                return JsonResponse({'error': 'API key not found in environment'}, status=500)

            image_file = request.FILES.get('image')
            if not image_file:
                return JsonResponse({'error': 'No image provided'}, status=400)

            if image_file.size > 2 * 1024 * 1024:
                return JsonResponse({'error': 'Image size must be less than 2MB'}, status=400)

            headers = {
                'Authorization': f'Api-Key {api_key}'
            }

            # Define the scopes
            scopes = [
                "multiple_items",
                "position",
                "nutrition:macro",
                "nutrition:micro",
                "nutrition:nutriscore",
                "quantity"
            ]

            # Create the form data correctly
            files = {
                'image': image_file,
            }
            
            # Add scopes as separate form field
            data = {
                'scopes[]': scopes  # Use scopes[] to send as array
            }

            response = requests.post(
                "https://vision.foodvisor.io/api/1.0/en/analysis/",
                headers=headers,
                files=files,
                data=data  # Send as form data
            )

            print("Response status:", response.status_code)
            print("Response text:", response.text)

            if response.status_code == 400:
                return JsonResponse({'error': 'Invalid image format. Please use JPG or PNG'}, status=400)
            elif response.status_code == 403:
                return JsonResponse({'error': 'API key unauthorized or invalid scope'}, status=403)
            elif response.status_code == 404:
                return JsonResponse({'error': 'Requested scope does not exist'}, status=404)
            elif response.status_code == 429:
                return JsonResponse({'error': 'API rate limit exceeded'}, status=429)
            elif response.status_code != 200:
                return JsonResponse({
                    'error': 'Failed to get nutrition facts',
                    'details': response.text,
                    'status': response.status_code
                }, status=response.status_code)

            return JsonResponse(response.json())

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)