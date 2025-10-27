## Mi Enfoque de Trabajo con IA

### Explica brevemente cómo abordas un proyecto desde cero cuando cuentas con un asistente de código.

Mi enfoque es actuar como un "Arquitecto de Contexto". En lugar de empezar a codificar, mi primer paso es descomponer la historia de usuario o el requisito principal en sus componentes lógicos (en este caso, Base de Datos, Backend y Frontend).

Utilizo una técnica de "meta-prompting" con un asistente de IA (como Gemini) para definir y refinar _tickets_ de trabajo muy detallados para cada uno de esos componentes. El objetivo es que estos tickets contengan todos los criterios de aceptación, tareas y detalles técnicos necesarios.
### ¿Cómo decides qué tareas dejar a la IA y cuáles asumir tú directamente?

Delego a la IA (Cursor) las tareas de **implementación y generación de código "boilerplate"**. Por ejemplo, escribir el modelo de la base de datos, crear la estructura del endpoint de la API, o construir el formulario de UI.

Yo asumo las tareas de **estrategia, definición y revisión**:
1. **Definición:** Crear los requisitos detallados (los archivos `.md`).
2. **Orquestación:** Decidir el _orden_ en que se deben ejecutar las tareas (primero la BD, luego el BE, luego el FE).
3. **Revisión y Control de Calidad:** Validar que el código generado por la IA cumple al 100% con los requisitos del ticket.
### ¿Cómo defines el nivel de detalle del prompt?
He descubierto que la clave no está en el detalle del _prompt_ en sí, sino en el detalle del _contexto_ que le proporciono.
Mi prompt para Cursor fue muy sencillo (ej. "Implementa el ticket definido en `Ticket 1.md`"). Sin embargo, el archivo `.md` al que hacía referencia era extremadamente detallado, conteniendo los campos del modelo, los códigos de respuesta esperados, las validaciones, etc.
El trabajo pesado se hace al **curar el contexto** (los archivos `.md`), no al escribir el prompt.
### ¿Qué aprendiste sobre el equilibrio entre delegar y razonar?
Aprendí que la IA es un multiplicador de fuerza excelente para la **ejecución**, pero la **calidad del razonamiento** previo lo es todo. Delegar sin un razonamiento claro (un ticket bien definido) produce resultados mediocres o incorrectos.
El equilibrio ideal fue: **yo razono, estructuro y defino; la IA ejecuta**. Invertir tiempo en definir claramente el "qué" y el "por qué" en los tickets permitió a la IA encargarse del "cómo" (la implementación) de forma muy eficiente.

---
## Aplicación Práctica de lo Aprendido
### Reflexiona sobre los conceptos vistos anteriormente (prompts efectivos, refinamiento, roles, iteraciones, testing, etc.)
#### ¿Qué técnicas aplicaste?
- **Descomposición de Problemas:** Dividir la historia de usuario en tres tickets claros (DB, BE, FE).
- **Refinamiento Iterativo (Meta-Prompting):** Usé una IA para generar los tickets iniciales, y luego yo los refiné y estructuré en formato Markdown para máxima claridad.
- **Contexto Externo:** En lugar de un prompt gigante, usé archivos `.md` externos como fuente única de verdad para cada tarea.
- **Roles:** Asumí el rol de "Arquitecto" o "Product Owner" definiendo los tickets, y le di a la IA (Cursor) el rol de "Desarrollador".
- **Iteración Secuencial:** Abordé el proyecto en tres iteraciones (prompts) separadas, permitiendo que el contexto se construyera de forma lógica (no se puede hacer el frontend sin el backend).
#### ¿Qué cambió en tu forma de escribir prompts o estructurar el proyecto?
Lo que cambió radicalmente fue dejar de intentar meter toda la lógica en el prompt. Ahora, mi objetivo es **crear un artefacto de contexto (el .md)  detallado** que el prompt para la IA de código sea una simple instrucción de "ejecutar esto". La estructuración en Markdown, con encabezados y listas, fue clave para que la IA lo entendiera.
#### ¿Qué hábitos mantuviste o mejoraste?
Mantuve el hábito de una clara separación de preocupaciones (SoC) entre las capas de la aplicación. Mejoré drásticamente el hábito de **definir explícitamente los requisitos _antes_ de tocar el código**; los archivos `.md` me forzaron a pensar en todos los casos de borde (validaciones, errores, tipos de archivo) por adelantado.

---
## Tu Colaboración con la IA durante este Ejercicio
### Describe cómo fue la interacción:
#### ¿Qué funcionó bien o te sorprendió?
Me sorprendió la **capacidad de la IA para mantener el contexto** siempre que estuviera bien estructurado. Al darle un archivo `.md` claro, Cursor entendió perfectamente la tarea y ejecutó el ticket completo sin desviarse. El hecho de que "en todo momento entendió el contexto" validó el enfoque de invertir tiempo en la calidad de los archivos de ticket.
#### ¿En qué momento la IA no entendió el contexto?
En este ejercicio particular, gracias al enfoque de archivos `.md` separados y la ejecución secuencial, **no hubo un momento en que la IA perdiera el contexto**. La tarea estaba tan acotada en cada prompt (limitada a un solo archivo) que no hubo lugar a confusión.
#### ¿Qué ajustes hiciste para lograr mejores resultados?
El ajuste principal fue **separar la ejecución en tres prompts distintos**. En lugar de pedirle que hiciera todo el proyecto de una vez, le pedí que implementara el ticket 1. Cuando terminó, le pedí que implementara el ticket 2 (que dependía del 1). Esta secuenciación fue fundamental para que la IA construyera sobre trabajo ya existente y validado.

---
## Decisiones Técnicas y de Diseño

- **Base de Datos (PostgreSQL):**
	- Elegido por su robustez, soporte ACID y escalabilidad.
	- Se usó Prisma como ORM para garantizar una interfaz con tipado fuerte y gestionar migraciones basadas en el schema.prisma.
	- Se empleó el tipo JSONB para education y work_experience, permitiendo flexibilidad estructural sin sacrificar rendimiento en las consultas.
	- El entorno de desarrollo se gestionó con Docker Compose para asegurar consistencia.
- **Backend (Node.js + Express + TypeScript):**
	- Se usó Node.js y Express por su eficiencia en operaciones I/O y la facilidad para construir APIs REST.
	- Se implementó TypeScript en toda la capa para un tipado estricto, reduciendo errores en tiempo de ejecución.
	- Prisma se integró para la lógica de negocio y el acceso a datos, aprovechando el tipado automático generado desde el esquema.
	- Se utilizó Multer para la subida de archivos, configurado para generar nombres únicos (con UUID) y prevenir colisiones.
	- Las validaciones de entrada se manejaron con express-validator, limpiando y asegurando los datos antes de que lleguen al controlador.
- **Frontend (React + TypeScript):**
	- Se eligió React por su ecosistema y la capacidad de crear componentes reutilizables (modales, campos de formulario).
	- Se usó TypeScript para mantener la coherencia del tipado en todo el stack y detectar errores en el desarrollo.
	- Se gestionó el estado local con Hooks de React.
	- El layout se construyó con CSS Grid/Flexbox para asegurar un diseño responsivo.
	- La comunicación con el backend se realizó mediante la Fetch API nativa.
---
**Aprendizajes y Próximos Pasos**
Sobre mi forma de trabajar con IA: Descubrí que mi mayor palanca de productividad es mi habilidad para definir problemas. 
A mejorar: Quiero integrar el testing en este flujo. Mi próximo paso será crear un cuarto ticket para que la IA genere pruebas (con Jest) basadas en los mismos requisitos de los archivos .md originales, cerrando así el ciclo de desarrollo.