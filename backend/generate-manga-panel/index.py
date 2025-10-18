import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate manga-style panel image using FLUX AI
    Args: event with httpMethod, body containing prompt for manga panel
          context with request_id
    Returns: JSON with image URL
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body')
    if not body_str:
        body_data = {}
    else:
        try:
            body_data = json.loads(body_str)
        except json.JSONDecodeError:
            body_data = {}
    user_prompt: str = body_data.get('prompt', '')
    panel_type: str = body_data.get('type', 'action')
    
    if not user_prompt:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'}),
            'isBase64Encoded': False
        }
    
    manga_styles = {
        'action': 'dynamic action scene, speed lines, dramatic angle, high contrast black and white manga style',
        'emotion': 'close-up emotional expression, detailed eyes, manga screentones, soft shading',
        'dialogue': 'medium shot conversation scene, clean lineart, manga panel layout',
        'effect': 'dramatic effect panel, abstract background, intense atmosphere, manga special effects'
    }
    
    style_prompt = manga_styles.get(panel_type, manga_styles['action'])
    full_prompt = f"Black and white manga art style, {user_prompt}, {style_prompt}, detailed linework, professional manga illustration"
    
    flux_api_key = os.environ.get('FLUX_API_KEY', '')
    
    if not flux_api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'FLUX_API_KEY not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        response = requests.post(
            'https://api.together.xyz/v1/images/generations',
            headers={
                'Authorization': f'Bearer {flux_api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'black-forest-labs/FLUX.1-schnell',
                'prompt': full_prompt,
                'width': 768,
                'height': 1024,
                'steps': 4,
                'n': 1
            },
            timeout=30
        )
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'FLUX API error: {response.text}'}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        image_url = result['data'][0]['url']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'imageUrl': image_url}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }