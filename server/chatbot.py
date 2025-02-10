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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add all frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    imageUrl: Optional[str] = None

def analyze_image(image_url: str):
    client = ImageAnalysisClient(
        endpoint=AZURE_ENDPOINT,
        credential=AzureKeyCredential(AZURE_KEY)
    )
    
    result = client.analyze_from_url(
        image_url=image_url,
        visual_features=[VisualFeatures.CAPTION, VisualFeatures.READ],
    )
    
    text_content = ""
    if result.read:
        for block in result.read.blocks:
            for line in block.lines:
                text_content += line.text + " "
    
    return {
        "caption": result.caption.text if result.caption else "",
        "text_content": text_content
    }

def process_with_gemini(business_data: dict, user_message: str, image_analysis: Optional[dict] = None):
    prompt = f"""
    You are a specialized AI business consultant. Analyze the following data and provide actionable insights:

    Business Data:
    {json.dumps(business_data, indent=2)}

    User Query: {user_message}

    {f'Image Analysis: {json.dumps(image_analysis, indent=2)}' if image_analysis else ''}

    Provide your response in JSON format with this structure:
    {{
        "message": "Your detailed response",
        "showChart": boolean,
        "chartType": "bar|scatter|none",
        "chartData": [] // Include if showChart is true
    }}

    Focus on business-related advice and analytics insights. If asked about non-business topics,
    redirect the conversation to business matters.
    """

    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    
    # Clean up the response if it contains markdown code blocks
    if raw_text.startswith("```json") and raw_text.endswith("```"):
        raw_text = raw_text[7:-3].strip()
    
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse response as JSON: {e}. Response: {raw_text}")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received chat request with message: {request.message}")
        
        image_analysis = None
        if request.imageUrl:
            logger.info(f"Processing image from URL: {request.imageUrl}")
            try:
                image_analysis = analyze_image(request.imageUrl)
            except Exception as e:
                logger.error(f"Image analysis error: {str(e)}")
                # Continue without image analysis
        
        response = process_with_gemini(
            business_data=request.businessData,
            user_message=request.message,
            image_analysis=image_analysis
        )
        
        logger.info("Successfully processed request")
        return response
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Add health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)