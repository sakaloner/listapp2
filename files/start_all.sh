#!/usr/bin/env bash

docker compose up &
source venv/bin/activate
cd api && uvicorn main:app --reload --log-level debug &
cd web
npm run dev

