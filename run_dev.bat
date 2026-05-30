@echo off
start cmd /k "cd .\shared && npm run watch"
start cmd /k "cd .\frontend && npm run dev"
start cmd /k "cd .\backend && npm run start:dev"