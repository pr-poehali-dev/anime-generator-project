import json
import os
from typing import Dict, Any, List
from dataclasses import dataclass
from openai import OpenAI

@dataclass
class Episode:
    number: int
    title: str
    synopsis: str
    duration: str = "24:00"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate unique anime story with 12 episodes using AI
    Args: event with httpMethod, body containing user prompt
          context with request_id
    Returns: JSON with anime title, genre, episodes, characters
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
    
    body_data = json.loads(event.get('body', '{}'))
    user_prompt: str = body_data.get('prompt', '')
    
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
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    client = OpenAI(api_key=api_key)
    
    system_prompt = """Ты — креативный сценарист аниме-студии. 
Создай детальный план аниме-сериала на 12 эпизодов по 24 минуты каждый.
Ответь в формате JSON:
{
  "title": "Название аниме на русском",
  "title_japanese": "Название на японском (ромадзи)",
  "genre": "Жанр / Поджанр",
  "synopsis": "Краткое описание всего сериала (2-3 предложения)",
  "characters": [
    {"name": "Имя", "role": "Роль", "description": "Краткое описание"},
    ...
  ],
  "episodes": [
    {"number": 1, "title": "Название эпизода", "synopsis": "Краткое описание эпизода"},
    ...
  ],
  "art_style": "Описание визуального стиля",
  "themes": ["Тема 1", "Тема 2"]
}"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Создай аниме на основе идеи: {user_prompt}"}
        ],
        temperature=0.9,
        response_format={"type": "json_object"}
    )
    
    anime_data = json.loads(response.choices[0].message.content)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(anime_data, ensure_ascii=False),
        'isBase64Encoded': False
    }
