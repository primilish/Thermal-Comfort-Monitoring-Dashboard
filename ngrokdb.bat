@echo off
start cmd /k "node server.js"
timeout /t 3
start cmd /k "ngrok http 3000"