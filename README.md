/-/ Flame Runner /-/

## Desarrollador
Sebastián Sujeros


## Descripción
Flame Runner es un juego de plataformas 2D donde controlás a Jhonn, un ciudadano de Cubustela que enloquece por el frío y se prende fuego a sí mismo. Convencido de que lo mejor es compartir el calor, corre por la ciudad congelada pasándoles las llamas a sus vecinos para salvarlos.

## El concepto: "Está mal, pero no tan mal"
Quemar a la gente normalmente está muy mal. Pero en Cubustela, donde todos se están muriendo de frío, hacerlo es la única forma de salvarlos. Está mal... pero no tan mal.

## Objetivo
Salvá al menos 3 ciudadanos congelados por nivel y llegá a la meta. Si tus puntos llegan a 0, tu fuego se apaga y perdés una vida. Quedarte sin vidas es un game over.

Controles
Flecha izquierda y derecha (← →): Moverse hacia la izquierda y derecha respectivamente
Flecha hacia arriba (↑): Saltar
El rescate de NPCs es automático al acercarse a ellos, sin tecla adicional.

## Mecánicas principales
Fuego como vida: el jugador arranca con 100 puntos por nivel que bajan solos con el tiempo. Si llegan a 0, el fuego se apaga y pierde una vida. Rescatar NPCs recarga los puntos.
Rescate automático: al tocar un NPC congelado se lo rescata instantáneamente.
Meta bloqueada: para poder pasar al siguiente nivel hay que haber rescatado al menos 3 NPCs y llegar a la flecha de salida.
Vidas y puntos entre niveles: tanto las vidas restantes como los puntos acumulados se pasan entre niveles.


## Puntos
Rescatar a un NPC: +100 puntos
Cada segundo que pasa: -10 puntos

Elementos que restan vidas
Quedarse sin puntos (fuego se apaga)
Tocar espinas (niveles 2 y 3)
Tocar un enemigo patrullero (nivel 3)

## Niveles
Nivel 1: nivel introductorio sin peligros. El jugador aprende los controles y el sistema de rescate. Solo hay NPCs dispersos por el mapa y la meta al final.
Nivel 2: el mapa se extiende horizontalmente. Aparecen pozos de espinas en el suelo que matan al contacto. Requiere saltos más precisos para navegar el terreno.
Nivel 3: el mapa es más grande en todas las direcciones. A las espinas se suman enemigos patrulleros que se mueven horizontalmente en un rango fijo y matan al contacto.

## NPCs
NPCs congelados: son ciudadanos inmóviles congelados distribuidos por cada nivel. Al tocarlos se activa una animación de descongelado y suman 100 puntos. Una vez rescatados desaparecen del mapa.
Enemigos patrulleros (Nivel 3): son enemigos parecidos a cubos de hielo que se mueven horizontalmente entre dos puntos fijos. No persiguen al jugador, solo patrullan su rango. Matan a Jhonn al contacto y reinician el nivel.

## Link al juego
[GitHub Pages — agregar link]

## Ejecutar localmente
Clonar el repositorio
Abrir la carpeta en VS Code
Iniciar Live Server sobre index.html

## Tecnologías
Phaser 3 v4.1.0
Tiled Map Editor
JavaScript