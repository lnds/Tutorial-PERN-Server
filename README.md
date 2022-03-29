# Tutorial Server PERN

En este tutorial implementaremos un servidor RESTFul usando el Stack PERN: Postgresql, Express, React and Node.

Este tutorial se puede ejecutar en replit.com o en el PC. 

Tratré de cubrir cada caso, comentarios, correcciones son bienvenidas via pull requests.


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
  mkdir tutorial-server
  cd tutorial-server
  npm init
  npm i express pg cors
  ```
  
El comando npm init te preguntará diversa información de tu proyecto, puedes llenarla o dejarla en blanco simplemente presionando `enter`, no es relevante para este ejercicio.

## Inicializando un servidor node

Dentro de la carpeta `tutorial-server` crea el archivo `index.js` y agrega este código:

  
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

  SERVER_PORT=3001 node index

Windows usando cmd:

  set SERVER_PORT=3001 && node index

Windows usando PowerShell

  PS> $env:SERVER_PORT=3001 ; node index

Navega a la dirección http://localhost:3001/ y debería aparecer una página con este mensaje:

    Cannot GET /

## Crear la base de datos

En este caso vamos a usar una conexion usando el servicio ElephantSQL, en la dirección: https://www.elephantsql.com

Este servicio nos provee acceso a instancias de PostgresSQL en la nube.

Una vez registrados presionamos el botón `new instance` que aparece en la parte superior de la página:

![](new-instance.png)

Elegimos crear una instancia tipo "Tiny Turtle" y llenamos el formulario con estos datos:

![](turtle-instance.jpg)

Después eliges la región, sugiero aceptar los parámetros ofrecidos, y finalmente confirmas.

Después eliges de la lista de instancias (si es que has creado otras bases de datos) la instancia PERN_TODO y en el menú de la izquierda eliges la opción BROWSE. DE este modo abres el browser y en la caja de texto escribes esta sentencia SQL

```SQL
CREATE TABLE todos (
   id SERIAL PRIMARY KEY,
   description VARCHAR(255)
);
```

Tal como se muestra en esta imagen (recuerda presionar el botón `execute >`):

![](browser.png)


### En tu PC

Si tienes PostgreSQL instalado en tu PC puedes crear la base datos con este comando:

```SQL
CREATE DATABASE pern_todo;
```

Y creas la tabla usando la sentencia descrita anteriormente.
Hay varias formas de hacer esto, por ejemplo se puede usando el comando `psql`.

En tu PC también puedes usar la base de datos que crearemos en ElephantSQL, así que no incluiré más instrucciones sobre PostgresSQL para PC, pero es relativamente fácil hacer lo mismo que hacemos con ElephantSQL en tu PC.

### Creando unos registros en la base de datos.

En el SQL Browser ejecuta estos comandos:

```SQL
INSERT INTO todos(description) VALUES('preparar el tutorial');
INSERT INTO todos(description) VALUES('preparar presentación para la clase');
```

(Recuerda presionar el botón `Execute >`).

Luego puedes verificar que has creado los registros con este comando:

```SQL
SELECT * FROM todos
```

Deberias poder ver los dos registros en el browser

![](select1.png)

## Conectando la base de datos

Selecciona `DETAILS` en ElephantSQL y accederás a una página con los detalles de conexión a la BD. Copia el valor que aparece en url al clipboard y úsalo para crear un secret llamado `CONNECTION_URL`.

![](details.png)

Fíjate que el campo URL tiene un botón que permite copiar este valor al clipboard.

Luego crea el archivo `db.js` y escribe este código en este:

```javascript
// db.js

const Pool = require("pg").Pool

const connUrl = process.env.CONNECTION_URL

const pool = new Pool({
    connUrl,
})

module.exports = pool
```

Y agrega esta linea en `index.js`, justo debajo de la declaraciónd de `cors`:

```javascript
const pool = require("./db")
```

Ejecuta `run >` nuevamente.

## Recuperar los registros (GET)

Agrega este código en index.js antes de `app.listen()...`:

```javascript
//get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query(
            "SELECT * FROM todos ORDER BY id"
        )
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message)
    }
})

```

Re inicia el server y verás esta resultado:

```
[
  {"id":1,"description":"preparar el tutorial"},
  {"id":2,"description":"preparar presentación para la clase"}
]
```

Que es la representación en formato JSON de los registros que están en nuestra base de datos.

**¡Felicitaciones, has creado tu primer endpoint RESTFul!**


## Recuperar un registro específico (GET)

Para recuperar sólo un registro debemos implementar el método get pero recibiendo un parámetro con el identificador del registro del siguiente modo:

```javascript
//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todo = await pool.query(
            "SELECT * FROM todos WHERE id = $1",
            [id]
        )
        res.json(todo.rows[0])
    } catch (err) {
        console.log(err)

    }
})
```


## Crear un registro (POST)

Ahora agregaremos un métdodo POST asociado al endpoint `/todos` para poder crear registros.

Agrega este código en `index.js`:

```javascript
//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query(
            "INSERT INTO todos(description) VALUES($1) RETURNING *",
            [description]
        )
        res.json(newTodo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})
```

### Probando el endpoint usando curl

En el Shell de Replit ejecuta curl de la siguiente forma:

  curl -X POST -H "Content-Type: application/json" \
    -d '{"description": "publicar servicio "}' \
    https://url-replit/todos

Puedes recuperar (GET) usando curl de esta forma:

  https://url-replit/todos

Reemplaza `url-replit` por el valor que genera REPLIT para tu entorno.

Para probar esto en tu PC reemplaza `url-replit` por `localhost:3001`

## Actualizar usando PUT

Ahora implementaremos la operación UPDATE usando el método PUT, agrega este código después del método GET:

```javascript
//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const updateTodo = await pool.query(
            "UPDATE todos SET description = $1 WHERE id = $2",
            [description, id]
        )
        console.log(updateTodo)
        res.json("Todo was updated")
    } catch (err) {
        console.log(err)

    }
})

### Probando el método PUT con Curl:

Ejecuta este código para probar este método:

    curl -X PUT -H "Content-type: application/json" -d '{"description": "preparar el tutorial PERN"}' https://url-replit/todos/1

Fíjate que a la url hemos agregado un `1` que corresponde al identificador del registro que queremos actualizar.

## Borrar registros usando el método DELETE

Finalmente agregamos el siguiente código para implementar el método DELETE:

```javascript
//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deleteTodo = await pool.query(
            "DELETE FROM todos WHERE id = $1",
            [id]
        )
        console.log(deleteTodo)
        res.json("todo was deleted")
    } catch (err) {
        console.error(err)

    }
})
```

### Probando el método DELETE con curl:

Ejecuta lo siguiente para borrar el primer registro de la base de datos:

  curl -X DELETE  https://url-replit/todos/1



## Ejercicios:

Averigua cómo responder con un código 404 cada vez que no se encuentre un registro en la base de datos.

Averigua cómo responder con un error 500 si se produce una excepcion.

(c) 2022 Eduardo Díaz
