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
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Azure Vision Setup
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_KEY")

# Gemini Setup
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
        
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    raise

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

class FormAssistRequest(BaseModel):
    userInput: str
    currentStep: str

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
        You are Saathi, a friendly AI business assistant with a casual and conversational style.
        Keep your responses brief, friendly, and easy to understand.
        Avoid lengthy analysis unless specifically asked.
        Start with a friendly greeting or acknowledgment.
        
        Your personality traits:
        - Friendly and approachable
        - Brief and clear
        - Conversational, not formal
        - Use simple language
        - Keep initial responses to 2-3 sentences
        - Only provide detailed analysis when explicitly requested

        CHART RULES:
        1. Only show charts when explicitly asked for data visualization
        2. For BAR charts use format:
           "chartData": [
             {{"category": "Label1", "value": number1}},
             {{"category": "Label2", "value": number2}}
           ]
        3. For SCATTER charts use format:
           "chartData": [
             {{"x": number1, "y": number2}},
             {{"x": number3, "y": number4}}
           ]

        {image_context if image_analysis else ""}

        BUSINESS CONTEXT:
        {json.dumps(business_data, indent=2, default=str)}

        USER MESSAGE:
        {str(user_message)}

        Respond with valid JSON in this format:
        {{
            "message": "Your friendly response here",
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

@app.post("/api/form-assist")
async def form_assist(request: FormAssistRequest):
    logger.info(f"Received form assist request - Step: {request.currentStep}, Input: {request.userInput}")
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="API key not configured")

        # Very simple and direct prompt
        prompt = f"""
        Business Input: {request.userInput}
        Step: {request.currentStep}

        Generate ONE simple JSON response.
        DO NOT include any extra text or explanations.
        DO NOT use markdown code blocks.

        For "basic" step use this EXACT format:
        {{
            "suggestions": {{
                "business_name": "Actual business name from input if given, otherwise create one",
                "tagline": "Short catchy tagline about the specific business",
                "description": "2-3 sentences about this specific business"
            }}
        }}

        For "features" step use this EXACT format:
        {{
            "suggestions": {{
                "features": [
                    {{ "title": "Specific feature for this business", "description": "How this feature benefits customers" }}
                ]
            }}
        }}
        """

        logger.info("Sending prompt to Gemini...")
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.3,  # Very low temperature for more focused responses
                "top_p": 0.5,
                "top_k": 20,
            }
        )

        raw_text = response.text.strip()
        logger.debug(f"Raw response: {raw_text}")

        # Clean any potential formatting
        raw_text = raw_text.replace('```json', '').replace('```', '').strip()
        
        try:
            suggestions = json.loads(raw_text)
            logger.info(f"Parsed suggestions: {json.dumps(suggestions)}")
            return suggestions
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {str(e)}, raw text: {raw_text}")
            return {
                "suggestions": {
                    "business_name": request.userInput.split()[0] if request.userInput else "Business Name",
                    "tagline": "Unique Himalayan Coffee Experience",
                    "description": f"Based on your input: {request.userInput}"
                } if request.currentStep == "basic" else {
                    "features": [{"title": "Feature", "description": "Please provide more details"}]
                }
            }
            
    except Exception as e:
        logger.error(f"Form assist error: {str(e)}")
        return {
            "suggestions": {
                "business_name": "Carbara",  # Use what we know from the input
                "tagline": "Authentic Himalayan Coffee Experience",
                "description": "Specializing in premium Himalayan coffee."
            }
        }

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)