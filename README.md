## Preparación

### En replit:

Crear un replit con node.js

```
   $ npm i express pg cors
```

### En tu PC:

Instala node.js, puedes descargarlo desde acá: https://nodejs.org/en/download/

Crear una carpeta e inicializar node dentro de esta:

  ```
  $ mkdir tutorial-server
  $ cd tutorial-server
  $ npm init
  $ npm i express pg cors
  ```
  
El comando npm init te preguntará diversa información de tu proyecto, puedes llenarla o dejarla en blanco simplemente presionando `enter`, no es relevante para este ejercicio.

## Inicializando un servidor node

Modifica el archivo index.js agrega este código:

  
```javascript
// index.js
const express = require("express")
const app = express()
const cors = require("cors")

const PORT = process.env.SERVER_PORT

//middleware
app.use(cors())
app.use(express.json())


app.listen(PORT, () => {
	console.log("servidor iniciado en puerto " + PORT)
})
```

## Ejecuta el servidor

Ejecuta el servidor como se explica más abajo. En la consola debe aparecer el mensaje:

    servidor iniciado en puerto 3001



### En Replit:

Configura un secret llamado SERVER_PORT e inicializalo con el valor 3001.

Los secrets están en el lado izquierdo y aparacen al presionar el botón con el candado.

Luego presiona el botón `> RUN` que aparece en la parte superior de replit.

En el lado derecho aparecerá un mini navegador web apuntando a tu servidor y aparecerá el mensaje:

    Cannot GET /
    

### En tu PC:

Si no existe el archivo index.js puedes crearlo con tu editor.

Para ejecutar tu programa debes hacer:

MacOs o Linux:

  $ SERVER_PORT=3001 node index

Windows usando cmd:

  > set SERVER_PORT=3001 && node index

Windows usando PowerShell

  PS> $env:SERVER_PORT=3001 ; node index

Navega a la dirección http://localhost:3001/ y debería aparecer una página con este mensaje:

    Cannot GET /



