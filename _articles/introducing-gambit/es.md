---
title: "Presentando Gambit: Skills de PM que se Verifican Solas"
date: "26 de junio de 2026"
readtime: "5 min de lectura"
type: essay
tags: [AI, Product Management, Open Source]
excerpt: "Construí una librería open source de skills de PM para asistentes de IA. No para que los PMs sean más rápidos, sino para que los outputs de IA fallen con menos silencio."
---

Llevo suficiente tiempo usando IA en mi trabajo de PM como para saber cómo se ve el fallo.

Te volvés más rápido. Los feature requests salen más limpios. Los resúmenes de discovery toman la mitad del tiempo. Y luego, tres sprints después, estás en una retro tratando de explicar por qué una funcionalidad que parecía sólida en papel se lanzó con los criterios de aceptación equivocados, o con un edge case que la investigación debería haber capturado, o resolviendo un problema que los usuarios nunca tuvieron.

La IA no te mintió. Te dio un output plausible. No lo detectaste porque lo estabas revisando igual que revisarías el borrador de un colega, escaneando errores obvios sin interrogar el razonamiento detrás.

Ese es el problema que Gambit intenta resolver.

## Qué es Gambit

[Gambit](https://github.com/felipecabargas/gambit) es una librería open source de skills de PM para asistentes de IA. Workflows estructurados, quality gates incorporados, cubriendo las tareas más comunes de PM: feature requests, mapeo de discovery, roadmaps, PRDs, user stories, release notes.

Está disponible como plugin en [el marketplace de Claude](https://claude.com/plugins) e indexada en el directorio de extensiones Antigravity/Gemini CLI.

Las skills no son prompts. Son workflows. Y la diferencia importa.

Un prompt le pide al modelo que produzca algo. Una skill le pide al modelo que produzca algo y luego verifique si realmente debería haberlo hecho. Cada skill de Gambit tiene checkpoints incorporados, momentos donde el modelo valida su propio output contra un estándar antes de que llegue a tus manos.

La skill de feature request no ensamblará un FR hasta confirmar que los criterios de aceptación cubren el happy path, los edge cases y los estados de fallo. La skill de roadmap no generará output hasta que cada iniciativa esté mapeada a un objetivo estratégico. La skill de discovery no simplemente resumirá lo que dijeron los usuarios. Marcará dónde la evidencia es débil y dónde un patrón puede ser una coincidencia.

## Por Qué Importa

El consejo estándar para usar IA en el trabajo de PM es mejorar el prompting. Ser más específico. Agregar contexto. Dar ejemplos. Ese consejo es correcto. También es insuficiente.

El problema no es el prompting. Es que los outputs de IA son epistémicamente inciertos. No podés saber de manera confiable si un output es correcto, incluso cuando parece correcto. Un feature request bien redactado con criterios de aceptación incorrectos se lee casi igual que uno con criterios correctos. La superficie es indistinguible.

No podés hacer QA de un output de IA como hacés QA de un build. Un build funciona o no funciona. Un output de IA siempre es plausible, y plausible no es lo mismo que correcto.

Gambit mueve el QA al workflow. Si el modelo tiene que pasar un quality gate antes de generar output, el fallo aparece antes y a menor costo. No siempre. Pero significativamente más seguido.

La filosofía de fondo es simple: reducir la incertidumbre en el proceso para poder tolerar la incertidumbre en el resultado. Vas a lanzar artefactos generados por IA con información imperfecta. La pregunta es si lo hacés con o sin una verificación estructurada del trabajo.

## Qué Hay en la Librería

Las skills actuales cubren el flujo de trabajo central de PM:

- **`map-discovery`**: Estructura hallazgos de investigación en patrones, distingue insights validados de supuestos, y marca vacíos de evidencia antes del resumen.
- **`write-feature-request`**: Redacta un feature request con criterios de aceptación, luego verifica cobertura en happy paths, edge cases y estados de fallo antes del output.
- **`write-roadmap`**: Construye una narrativa de roadmap y verifica cada iniciativa contra OKRs definidos antes de devolverla.
- **`write-prd`**: Produce un PRD completo con secciones para problema, hipótesis, métricas de éxito y fuera de alcance, y valida la consistencia interna.
- **`write-user-stories`**: Desglosa funcionalidades en user stories en formato estándar, verifica si falta contexto, y marca historias demasiado grandes para estimar con confianza.
- **`write-release-notes`** y **`write-change-log`**: Genera entradas de changelog para usuarios internos y externos, calibradas según la audiencia.

Cada skill es un archivo `SKILL.md`. El formato es abierto. Podés hacer fork, modificar los gates, agregar los tuyos propios, o contribuir de vuelta al repo.

## Lo Que No Hace

Gambit no va a escribir tu estrategia. No va a decirte qué construir. No va a reemplazar el juicio que viene de conocer a tus usuarios, tu mercado y tus restricciones.

Lo que sí va a hacer es asegurarse de que, una vez que tomaste una decisión, el artefacto que generás para ejecutarla no esté silenciosamente equivocado de maneras que solo descubrís cuando es costoso.

Esa es una promesa más estrecha que la que hace la mayoría de las herramientas de IA. Creo que es más honesta.

## Cómo Obtenerlo

**Vía Claude:** Instalá desde [claude.com/plugins](https://claude.com/plugins) y buscá Gambit. Una vez instalado, las skills están disponibles en cualquier conversación de Claude.

**Vía Gemini CLI:** La librería está indexada en el directorio de extensiones Antigravity/Gemini CLI como `felipecabargasgambit`.

**Desde el código:** La librería completa está en [github.com/felipecabargas/gambit](https://github.com/felipecabargas/gambit). Cloná, leé los archivos SKILL.md, usalos directamente, o adaptalos para tu setup.

## Por Qué Open Source

Porque el valor de una librería de skills de PM no está en mantenerla propietaria. Está en hacerla lo suficientemente buena como para que la gente la use y la mejore.

Los quality gates que construí reflejan mis propios fallos. Los de otra persona van a ser distintos. La librería mejora cuando más personas encuentran los huecos.

Si la usás y algo está mal, abrí un issue. O hacé fork y mandá un PR. El repo existe para las dos cosas.

---

*Gambit es open source bajo MIT. El código está en [github.com/felipecabargas/gambit](https://github.com/felipecabargas/gambit). El plugin de Claude está listado en [claude.com/plugins](https://claude.com/plugins).*
