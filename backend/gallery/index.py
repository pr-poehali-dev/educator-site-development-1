import json
import os
import base64
import uuid
from typing import Dict, Any

try:
    import psycopg2
except ImportError:
    psycopg2 = None

try:
    import boto3
except ImportError:
    boto3 = None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления галереей фотографий
    Args: event - HTTP запрос с методами GET/POST/DELETE
          context - контекст выполнения функции
    Returns: JSON с фотографиями или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute(
                "SELECT id, title, image_url, created_at FROM gallery_photos ORDER BY display_order DESC, created_at DESC"
            )
            rows = cur.fetchall()
            photos = [
                {
                    'id': row[0],
                    'title': row[1],
                    'image_url': row[2],
                    'created_at': row[3].isoformat() if row[3] else None
                }
                for row in rows
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'photos': photos}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            headers = event.get('headers', {})
            admin_password = headers.get('x-admin-password', headers.get('X-Admin-Password', ''))
            
            if admin_password != 'admin2024':
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Неверный пароль администратора'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title', '')
            image_base64 = body_data.get('image', '')
            
            if not title or not image_base64:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Требуются поля title и image'}),
                    'isBase64Encoded': False
                }
            
            image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
            
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            file_id = str(uuid.uuid4())
            file_key = f'gallery/{file_id}.jpg'
            
            s3.put_object(
                Bucket='files',
                Key=file_key,
                Body=image_data,
                ContentType='image/jpeg'
            )
            
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
            
            cur.execute(
                "INSERT INTO gallery_photos (title, image_url) VALUES (%s, %s) RETURNING id",
                (title, cdn_url)
            )
            photo_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'id': photo_id,
                    'image_url': cdn_url
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            headers = event.get('headers', {})
            admin_password = headers.get('x-admin-password', headers.get('X-Admin-Password', ''))
            
            if admin_password != 'admin2024':
                return {
                    'statusCode': 403,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Неверный пароль администратора'}),
                    'isBase64Encoded': False
                }
            
            params = event.get('queryStringParameters', {})
            photo_id = params.get('id')
            
            if not photo_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Требуется параметр id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("DELETE FROM gallery_photos WHERE id = %s", (photo_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()