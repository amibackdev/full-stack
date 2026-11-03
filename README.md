readme = """# Task Tracker

Fullstack-приложение для создания и управления личными задачами. Пользователь может добавлять задачи с описанием, приоритетом, сроком выполнения и фотографией, просматривать список задач, искать и фильтровать их, редактировать и удалять.

## Возможности

- Создание задач с названием, описанием, приоритетом и дедлайном.
- Загрузка фотографии к новой задаче.
- Просмотр списка и отдельной страницы задачи.
- Редактирование данных задачи.
- Удаление задачи с подтверждением.
- Поиск по названию и описанию.
- Фильтрация по приоритету.
- Сортировка по сроку выполнения и приоритету.
- Отображение просроченных задач.
- Адаптивный интерфейс, состояния загрузки и сообщения об ошибках.

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Three.js
- Lucide React
- CSS

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- express-fileupload
- uuid

## Структура проекта

```text
fullstack_project_first/
├── back/
│   ├── controllers/       # Обработка запросов и логика задач
│   ├── middleware/        # Сохранение и проверка загружаемых файлов
│   ├── models/            # Mongoose-модель задачи
│   ├── routes/            # API-маршруты
│   ├── uploads/           # Загруженные изображения
│   ├── package.json
│   └── server.js          # Запуск Express и подключение MongoDB
│
└── front/
    ├── src/
    │   ├── api/           # Запросы к backend и типы данных
    │   ├── components/    # Переиспользуемые компоненты интерфейса
    │   ├── pages/         # Страницы приложения
    │   ├── three/         # 3D-элементы на Three.js
    │   ├── utils/         # Вспомогательные функции
    │   ├── styles/        # Стили
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

## Требования

Перед запуском установите:

- Node.js (рекомендуется актуальная LTS-версия)
- npm
- MongoDB Community Server или доступный экземпляр MongoDB

По умолчанию backend подключается к MongoDB по адресу:

```text
mongodb://localhost:27017/tracker
```

## Установка и запуск

### 1. Клонирование проекта

```bash
git clone <URL-репозитория>
cd fullstack_project_first
```

### 2. Запуск backend

Откройте терминал и перейдите в папку backend:

```bash
cd back
npm install
```

Убедитесь, что MongoDB запущена, затем выполните:

```bash
node server.js
```

Backend будет доступен на:

```text
http://localhost:5000
```

### 3. Запуск frontend

Откройте второй терминал:

```bash
cd front
npm install
```

Создайте файл `.env` на основе `.env.example` (если `.env` ещё не создан):

```env
VITE_API_URL=/api
DEV_BACKEND_URL=http://localhost:5000
```

Запустите приложение:

```bash
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:5173
```

> Для корректной работы сначала запустите MongoDB, затем backend и frontend. В режиме разработки Vite проксирует запросы с префиксом `/api` на backend, поэтому отдельно настраивать CORS не требуется.

## API

Backend предоставляет следующие маршруты:

| Метод | Маршрут | Описание |
|---|---|---|
| GET | `/tasks` | Получить список всех задач |
| GET | `/task/:id` | Получить задачу по ID |
| POST | `/tasks` | Создать новую задачу |
| PATCH | `/task/:id` | Обновить задачу |
| DELETE | `/task/:id` | Удалить задачу |

### Создание задачи

`POST /tasks`

Тело запроса отправляется в формате `multipart/form-data`.

Поля:

| Поле | Тип | Обязательное | Описание |
|---|---|---|---|
| `title` | string | Да | Название задачи |
| `description` | string | Да | Описание задачи |
| `priority` | string | Да | Приоритет (`low`, `medium`, `high`) |
| `deadline` | number | Да | Срок выполнения в формате Unix timestamp (миллисекунды) |
| `photo` | file | Нет | Изображение задачи |

### Обновление задачи

`PATCH /task/:id`

Принимает JSON с изменяемыми полями: `title`, `description`, `priority`, `deadline`. Можно отправлять только те поля, которые требуется изменить. Загрузка или замена фотографии через этот маршрут не реализована.

### Загрузка изображений

Изображения сохраняются в папку `back/uploads` и доступны через маршрут `/uploads/...`.

Ограничения на загрузку:
- максимальный размер файла — 5 МБ;
- разрешённые форматы: JPG, JPEG, PNG, GIF и WEBP;
- фотография необязательна.

## Проверка frontend

Из папки `front` можно выполнить:

```bash
npm run typecheck
npm run build
```

Для локального просмотра production-сборки:

```bash
npm run preview
```

## Примечания

- Поиск, фильтрация и сортировка выполняются на стороне frontend.
- Приоритеты в интерфейсе: низкий (`low`), средний (`medium`) и высокий (`high`).
- Просрочка определяется по дедлайну; отдельное поле статуса выполнения в текущей модели не предусмотрено.
- Авторизация пользователей в текущей версии не реализована.
- Для хранения задач используется MongoDB, для фотографий — файловая система сервера.
"""
out='/mnt/data/README.md'
with open(out,'w',encoding='utf-8') as f: f.write(readme)
# create updated copy of original zip with root README, excluding any previous root readme if present
import zipfile, os
newzip='/mnt/data/fullstack_project_first_with_readme.zip'
with zipfile.ZipFile(p,'r') as zin, zipfile.ZipFile(newzip,'w',zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename == 'fullstack_project_first/README.md':
            continue
        zout.writestr(item, zin.read(item.filename))
    zout.writestr('fullstack_project_first/README.md', readme)
os.path.getsize(out), os.path.getsize(newzip)
