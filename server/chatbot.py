from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
import google.generativeai as genai
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
import json
from fastapi.middleware.cors import CORSMiddleware
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Azure Vision Setup
AZURE_ENDPOINT = "https://magnum.cognitiveservices.azure.com/"
AZURE_KEY = "4ideuxnCLcWS3Ysb7qmjZI6DJkkZme3HF2KxQ1aFZUd6Rv269EADJQQJ99BAACqBBLyXJ3w3AAAFACOGW4fo"

# Gemini Setup
GEMINI_API_KEY = 'AIzaSyAF8G1xWsUlsTmqgtJfqNO1KX6alwq7i1w'
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request error: {str(e)}")
        raise

class ChatRequest(BaseModel):
    message: str
    businessData: Dict[str, Any]
    imageUrl: Optional[str] = None  # This will now accept base64 strings

def analyze_image(image_base64: str):
    try:
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
            
        import base64
        import requests

        # Correct Azure Vision API endpoint
        url = f"{AZURE_ENDPOINT}computervision/imageanalysis:analyze"  # Updated endpoint

        # Query parameters
        params = {
            'api-version': '2023-04-01-preview',
            'features': 'caption,read,tags,objects',
            'model-version': 'latest',
            'language': 'en'
        }

        # Headers
        headers = {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': AZURE_KEY
        }

        # Decode and send image
        image_data = base64.b64decode(image_base64)
        
        logger.info(f"Sending request to Azure Vision API: {url}")
        response = requests.post(url, params=params, headers=headers, data=image_data)

        if response.status_code != 200:
            logger.error(f"Azure Vision API response: {response.status_code} - {response.text}")
            raise Exception(f"Azure Vision API error: {response.text}")

        result = response.json()
        logger.info("Got response from Azure Vision API")
        
        # Extract results
        analysis = {
            "caption": result.get('captionResult', {}).get('text', ''),
            "text_content": " ".join([
                line.get('text', '')
                for block in result.get('readResult', {}).get('blocks', [])
                for line in block.get('lines', [])
            ]),
            "tags": [tag.get('name') for tag in result.get('tagsResult', {}).get('values', [])],
            "objects": [obj.get('name') for obj in result.get('objectsResult', {}).get('values', [])]
        }
        
        logger.info("Image analysis completed successfully")
        return analysis
            
    except Exception as e:
        logger.error(f"Image analysis error: {str(e)}")
        return {
            "caption": "Failed to analyze image",
            "text_content": f"Error: {str(e)}",
            "tags": [],
            "objects": []
        }

def process_with_gemini(business_data: dict, user_message: str, image_analysis: Optional[dict] = None):
    try:
        # Prepare image analysis text, handling None values
        image_context = ""
        if image_analysis:
            image_context = f"""
            IMAGE ANALYSIS RESULTS:
            - Description: {str(image_analysis.get('caption', 'No caption available'))}
            - Detected Text: {str(image_analysis.get('text_content', 'No text detected'))}
            - Identified Objects: {', '.join(str(obj) for obj in image_analysis.get('objects', []) if obj)}
            - Tags: {', '.join(str(tag) for tag in image_analysis.get('tags', []) if tag)}
            """

        # Create the prompt with safe string handling
        prompt = f"""
        You are a specialized AI business consultant. I'm providing you with business data and user query.
        
        STRICT CHART RULES:
        1. ONLY show charts for numerical data analysis
        2. Dont show charts when not asked
        3. For BAR charts use format:
           "chartData": [
             {{"category": "Label1", "value": number1}},
             {{"category": "Label2", "value": number2}}
           ]
        4. For SCATTER charts use format:
           "chartData": [
             {{"x": number1, "y": number2}},
             {{"x": number3, "y": number4}}
           ]

        {image_context if image_analysis else ""}

        BUSINESS CONTEXT:
        {json.dumps(business_data, indent=2, default=str)}

        USER QUERY:
        {str(user_message)}

        Respond with valid JSON in this format:
        {{
            "message": "Your response here",
            "showChart": false,
            "chartType": "none",
            "chartData": []
        }}
        """

        logger.info("Sending prompt to Gemini...")
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            raise ValueError("Empty response from Gemini")
            
        raw_text = response.text.strip()
        
        # Clean up response
        if raw_text.startswith("```json") and raw_text.endswith("```"):
            raw_text = raw_text[7:-3].strip()
        
        # Parse and validate response
        parsed_response = json.loads(raw_text)
        
        # Ensure all required fields exist
        required_fields = {
            "message": str,
            "showChart": bool,
            "chartType": str,
            "chartData": list
        }
        
        for field, field_type in required_fields.items():
            if field not in parsed_response or not isinstance(parsed_response[field], field_type):
                parsed_response[field] = field_type()
        
        return parsed_response

    except Exception as e:
        logger.error(f"Gemini processing error: {str(e)}")
        return {
            "message": "I apologize, but I couldn't process that request properly. Please try again.",
            "showChart": False,
            "chartType": "none",
            "chartData": []
        }

@app.options("/api/chat")
async def options_handler():
    return {}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    logger.info(f"Received chat request with message: {request.message}")
    try:
        image_analysis = None
        if request.imageUrl:
            logger.info("Image URL received, processing...")
            image_analysis = analyze_image(request.imageUrl)
            logger.info(f"Image analysis results: {json.dumps(image_analysis)}")
        
        response = process_with_gemini(
            business_data=request.businessData,
            user_message=request.message,
            image_analysis=image_analysis
        )
        
        # Log the final response
        logger.info(f"Sending response: {json.dumps(response)}")
        return response
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)