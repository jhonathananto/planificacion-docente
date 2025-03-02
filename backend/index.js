const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Ruta para la raíz (/)
app.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido al backend! Prueba /api para más.' });
});
  
// Ruta de prueba con consulta a la base de datos
app.get('/api', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, first_name FROM public.user_user');
        console.log('Resultados de la consulta:');
        console.table(result.rows);  // Imprime la consulta como tabla en consola

        res.json({
            message: '¡Backend funcionando!',
            data: result.rows  // Puedes devolver los datos si deseas
        });
    } catch (error) {
        console.error('Error al ejecutar consulta:', error);
        res.status(500).json({ message: 'Error al obtener datos de la base de datos' });
    }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query(
        'SELECT username, first_name FROM user_user WHERE username = $1 AND first_name = $2',
        [username, password]
      );
      if (result.rows.length > 0) {
        res.json({ success: true, user: result.rows[0] });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  });