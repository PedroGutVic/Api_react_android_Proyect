# Curl tests - VideoGame API

Base URL:

```
http://0.0.0.0:8081/videogame
```

## GET all

```bash
curl -i http://0.0.0.0:8081/videogame
```

## GET by id (query)

```bash
curl -i "http://0.0.0.0:8081/videogame?id=1"
```

## GET by plataforma (query)

```bash
curl -i "http://0.0.0.0:8081/videogame?plataforma=PC"
```

## GET by id (path)

```bash
curl -i http://0.0.0.0:8081/videogame/2
```

## POST create (id 7)

```bash
curl -i -X POST http://0.0.0.0:8081/videogame \
  -H "Content-Type: application/json" \
  -d '{
    "id": 7,
    "nombre": "Celeste",
    "precio": 19.99,
    "plataforma": "PC",
    "caracteristicas": "Plataformas con narrativa"
  }'
```

## PATCH update (id 7)

```bash
curl -i -X PATCH http://0.0.0.0:8081/videogame/7 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 17.99,
    "caracteristicas": "Plataformas con narrativa y desafio"
  }'
```

## DELETE (id 7)

```bash
curl -i -X DELETE http://0.0.0.0:8081/videogame/7
```
