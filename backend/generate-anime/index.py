import json
import hashlib
import random
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate unique anime story with 12 episodes using algorithmic generation
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
    
    seed = int(hashlib.md5(user_prompt.encode()).hexdigest(), 16) % (10 ** 8)
    rng = random.Random(seed)
    
    genres = [
        "Фэнтези / Приключения",
        "Научная фантастика / Киберпанк",
        "Школьная жизнь / Драма",
        "Боевые искусства / Сёнен",
        "Романтика / Комедия",
        "Мистика / Триллер",
        "Исторический / Самураи",
        "Спорт / Соревнование",
        "Меха / Военный",
        "Фэнтези / Магия"
    ]
    
    art_styles = [
        "Детализированная прорисовка в стиле Kyoto Animation с мягкими тенями",
        "Динамичная анимация студии Ufotable с яркими эффектами",
        "Минималистичный стиль Trigger с экспрессивной мимикой",
        "Реалистичная прорисовка Production I.G с кинематографичными ракурсами",
        "Яркая палитра Bones с плавными переходами",
        "Готический стиль Shaft с необычными углами камеры"
    ]
    
    themes_pool = [
        "Дружба и верность", "Поиск себя", "Преодоление трудностей",
        "Борьба добра и зла", "Цена силы", "Семейные узы",
        "Месть и прощение", "Любовь и жертва", "Судьба и выбор",
        "Технологии и человечность", "Мечты и реальность", "Свобода и долг"
    ]
    
    first_names = ["Харуто", "Юки", "Рин", "Акира", "Сора", "Каэде", "Хината", "Юма", "Аой", "Рен", 
                   "Такэси", "Мэй", "Кента", "Саяка", "Дайки", "Нана", "Райто", "Мику", "Ёсуке", "Хикари"]
    last_names = ["Танака", "Сато", "Ямамото", "Кобаяши", "Ватанабэ", "Накамура", "Мори", "Хаяси", "Судзуки", "Ито",
                  "Такахаси", "Мацумото", "Иноуэ", "Кимура", "Симидзу", "Ямада", "Сасаки", "Кудо", "Фудзита", "Оно"]
    
    roles = [
        "Главный герой-новичок с скрытым потенциалом",
        "Мудрый наставник с загадочным прошлым",
        "Верный друг и комический персонаж",
        "Загадочный антагонист с благими намерениями",
        "Талантливая героиня с сильным характером",
        "Соперник, который станет союзником",
        "Загадочный незнакомец с важной информацией",
        "Младший брат/сестра с уникальной способностью",
        "Безумный учёный или исследователь",
        "Предатель с трагической историей",
        "Хранитель древних знаний",
        "Воин с кодексом чести",
        "Целитель с тёмным секретом",
        "Шпион из враждебной организации",
        "Торговец редкими артефактами",
        "Бывший враг, ставший союзником",
        "Таинственный ребёнок с пророческими видениями",
        "Механик или изобретатель",
        "Искусный вор с золотым сердцем",
        "Одержимый местью родственник"
    ]
    
    episode_templates = [
        "Начало путешествия — {hero} обнаруживает свою судьбу",
        "Первое испытание — встреча с {rival}",
        "Обучение и тренировка под руководством {mentor}",
        "Появление угрозы — первое столкновение с врагом",
        "Формирование команды — новые союзники",
        "Раскрытие тайны прошлого главного героя",
        "Внутренний конфликт и моральная дилемма",
        "Предательство и неожиданный поворот",
        "Потеря и осознание истинной силы",
        "Решающая битва — подготовка к финалу",
        "Кульминация — столкновение с главным врагом",
        "Новые горизонты — завершение и надежда на будущее"
    ]
    
    genre = rng.choice(genres)
    art_style = rng.choice(art_styles)
    themes = rng.sample(themes_pool, 3)
    
    title_words = user_prompt.split()[:3]
    title = " ".join([w.capitalize() for w in title_words])
    if not title:
        title = "Новая история"
    
    num_characters = rng.randint(8, 15)
    characters = []
    used_names = set()
    
    for i in range(num_characters):
        while True:
            char_name = f"{rng.choice(first_names)} {rng.choice(last_names)}"
            if char_name not in used_names:
                used_names.add(char_name)
                break
        
        role = roles[i] if i < len(roles) else rng.choice(roles)
        characters.append({
            "name": char_name,
            "role": role,
            "description": f"Персонаж с уникальной историей, связанной с темой: {rng.choice(themes)}"
        })
    
    hero_name = characters[0]["name"].split()[0] if characters else "герой"
    mentor_name = characters[1]["name"].split()[0] if len(characters) > 1 else "наставник"
    rival_name = characters[2]["name"].split()[0] if len(characters) > 2 else "соперник"
    
    opening_songs = [
        {"title": "Mirai e no Tobira", "artist": "LiSA"},
        {"title": "Kibou no Hikari", "artist": "YOASOBI"},
        {"title": "Shinjitsu no Michi", "artist": "Aimer"},
        {"title": "Tsubasa wo Kudasai", "artist": "RADWIMPS"},
        {"title": "Sekai no Hate Made", "artist": "Eve"}
    ]
    
    ending_songs = [
        {"title": "Sayonara no Uta", "artist": "Kenshi Yonezu"},
        {"title": "Tsuki to Hoshi", "artist": "Official HIGE DANdism"},
        {"title": "Ashita e", "artist": "Aimyon"},
        {"title": "Yume no Kakera", "artist": "King Gnu"},
        {"title": "Kanashimi no Iro", "artist": "BUMP OF CHICKEN"}
    ]
    
    opening = rng.choice(opening_songs)
    ending = rng.choice(ending_songs)
    
    episodes = []
    for i, template in enumerate(episode_templates, 1):
        ep_title = template.format(hero=hero_name, mentor=mentor_name, rival=rival_name)
        synopsis = f"В этом эпизоде {hero_name} сталкивается с новыми вызовами. {user_prompt[:50]}... Развитие сюжета приводит к важным открытиям."
        
        episodes.append({
            "number": i,
            "title": f"Эпизод {i}: {ep_title[:40]}",
            "synopsis": synopsis[:150],
            "duration": "24:00",
            "opening": opening,
            "ending": ending
        })
    
    anime_data = {
        "title": title,
        "title_japanese": "Shin Sekai",
        "genre": genre,
        "synopsis": f"{user_prompt}. История о {hero_name}, который отправляется в невероятное путешествие, полное испытаний и открытий.",
        "characters": characters,
        "episodes": episodes,
        "art_style": art_style,
        "themes": themes,
        "studio": "AI Animation Studio",
        "year": 2025,
        "quality": "4K Ultra HD",
        "audio": "Японская озвучка + Русские субтитры",
        "opening": opening,
        "ending": ending
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(anime_data, ensure_ascii=False),
        'isBase64Encoded': False
    }