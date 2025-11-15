@echo off
title Mise a jour du Portfolio

echo ====================================
echo   MISE A JOUR DU PORTFOLIO VERS GITHUB
echo ====================================
echo.

:: Demande un message pour le commit
set /p commit_message="Entrez un message pour cette mise a jour (ex: 'ajout photo projet'): "

:: Si le message est vide, met un message par defaut
if "%commit_message%"=="" (
  set commit_message="Mise a jour rapide du site"
)

echo.
echo [1/3] Ajout de tous les fichiers (git add .)...
git add .

echo.
echo [2/3] Sauvegarde des fichiers (git commit)...
git commit -m "%commit_message%"

echo.
echo [3/3] Envoi des fichiers vers GitHub (git push)...
git push origin master

echo.
echo ====================================
echo   MISE A JOUR TERMINEE !
echo ====================================
echo.
pause