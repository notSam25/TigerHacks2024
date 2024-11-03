from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
import os
import base64
import google.generativeai as genai
import PIL.Image
import io

load_dotenv()


@csrf_exempt
def NutritionFacts(request):
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "POST":
        try:
            # Configure Gemini
            genai.configure(api_key=os.getenv("API_KEY"))

            # Get image from request
            image_file = request.FILES.get("image")
            if not image_file:
                return JsonResponse({"error": "No image provided"}, status=400)

            # Convert to PIL Image
            image_bytes = image_file.read()
            image = PIL.Image.open(io.BytesIO(image_bytes))

            # Initialize Gemini model
            model = genai.GenerativeModel("gemini-1.5-flash")

            # First question - ingredients
            ingredients_response = model.generate_content(
                [
                    image,
                    "\n\n",
                    """List ONLY the ingredients and their quantities for the food in this image.
                    Format: Return each ingredient with its amount on a new line.
                    Example format:
                    2 cups flour
                    1 tsp salt
                    3 tbsp sugar
                    
                    Do not include any other text or descriptions.""",
                ]
            )

            print(ingredients_response.text)

            # Second question - nutrition info
            nutrition_response = model.generate_content(
                [
                    image,
                    "\n\n",
                    f"""Please analyze this food and provide ONLY the following nutritional values as numbers (no units or text):
                1. Total Calories (kcal)
                2. Total Fat (g)
                3. Sodium (mg)
                4. Cholesterol (mg)
                5. Total Carbohydrates (g)
                6. Protein (g)

                Also use these ingredients to calculate the nutrition values as well if they help: {ingredients_response.text}
                
                Format: Return only 6 numbers separated by commas, in the exact order above.""",
                ]
            )

            print(nutrition_response.text)

            # Parse the response into array of integers
            try:
                # Split by comma and convert to integers
                nutrition_values = [
                    int(float(x.strip()))
                    for x in nutrition_response.text.replace("\n", "").split(",")
                ]

                print(nutrition_values)

                # Ensure we have exactly 6 values
                if len(nutrition_values) != 6:
                    raise ValueError("Invalid number of nutrition values returned")

                return JsonResponse(
                    {
                        "ingredients": ingredients_response.text,
                        "nutrition": nutrition_values,
                    }
                )

            except Exception as e:
                print(f"Error parsing nutrition values: {str(e)}")
                return JsonResponse(
                    {"error": "Failed to parse nutrition values"}, status=500
                )

        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)
