# Información base para el documento final

Este archivo reúne el contenido técnico que puede trasladarse al Google Docs cuando se comparta el enlace. No es un PDF.

## Descripción breve

Lumen es un sistema web de biblioteca para mantener un catálogo digital y controlar préstamos. El usuario puede registrar, editar, buscar y eliminar libros disponibles; también puede prestar un ejemplar a un lector y registrar su devolución. El panel presenta totales de ejemplares, disponibilidad, préstamos y categorías.

## Decisiones técnicas

React y Vite ofrecen una interfaz modular y rápida. Express expone una API REST fácil de probar. SQLite proporciona integración con una base de datos real sin exigir Docker ni configuración adicional, lo que hace que el proyecto sea reproducible en el equipo del docente y en GitHub Actions. El módulo nativo de Node reduce dependencias binarias.

## Reflexión sugerida para personalizar

La automatización mostró que probar no consiste únicamente en verificar funciones individuales. Las pruebas unitarias dan retroalimentación inmediata, las de integración encuentran problemas en los límites entre API y base de datos, y Cypress valida el recorrido que realmente experimenta una persona. k6 añadió una perspectiva distinta: un endpoint correcto también debe responder de forma estable bajo concurrencia. Separar estas capas en GitHub Actions facilita identificar el origen de un fallo y evita integrar cambios que rompan el sistema.

> Personaliza esta reflexión con dificultades y aprendizajes reales antes de entregar.
