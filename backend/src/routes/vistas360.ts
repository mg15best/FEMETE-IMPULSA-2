import express from 'express';
import {
  getPersona360,
  getAllPersonas360,
  getEmpresa360,
  getAllEmpresas360,
  getFormacion360,
  getAllFormaciones360,
  getEvento360,
  getAllEventos360,
  getTimelineActividades,
  getEstadisticasGenerales,
  getPersonaRelaciones,
  getEmpresaRelaciones
} from '../controllers/vista360Controller';

const router = express.Router();

/**
 * @swagger
 * /api/vistas360/personas/{id}:
 *   get:
 *     summary: Get 360º view of a person
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 360º view of person with all relationships and activities
 */
router.get('/personas/:id', getPersona360);

/**
 * @swagger
 * /api/vistas360/personas:
 *   get:
 *     summary: Get 360º view of all people
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: empresa_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of 360º views
 */
router.get('/personas', getAllPersonas360);

/**
 * @swagger
 * /api/vistas360/personas/{id}/relaciones:
 *   get:
 *     summary: Get all relationships for a person
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All relationships and activities for the person
 */
router.get('/personas/:id/relaciones', getPersonaRelaciones);

/**
 * @swagger
 * /api/vistas360/empresas/{id}:
 *   get:
 *     summary: Get 360º view of a company
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 360º view of company with all relationships and activities
 */
router.get('/empresas/:id', getEmpresa360);

/**
 * @swagger
 * /api/vistas360/empresas:
 *   get:
 *     summary: Get 360º view of all companies
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *       - in: query
 *         name: nivel_actividad
 *         schema:
 *           type: string
 *           enum: [Activo, Regular, Inactivo]
 *     responses:
 *       200:
 *         description: List of 360º views
 */
router.get('/empresas', getAllEmpresas360);

/**
 * @swagger
 * /api/vistas360/empresas/{id}/relaciones:
 *   get:
 *     summary: Get all relationships for a company
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All relationships and activities for the company
 */
router.get('/empresas/:id/relaciones', getEmpresaRelaciones);

/**
 * @swagger
 * /api/vistas360/formaciones/{id}:
 *   get:
 *     summary: Get 360º view of a training
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 360º view of training with attendees and statistics
 */
router.get('/formaciones/:id', getFormacion360);

/**
 * @swagger
 * /api/vistas360/formaciones:
 *   get:
 *     summary: Get 360º view of all trainings
 *     tags: [Vistas 360º]
 *     responses:
 *       200:
 *         description: List of 360º views
 */
router.get('/formaciones', getAllFormaciones360);

/**
 * @swagger
 * /api/vistas360/eventos/{id}:
 *   get:
 *     summary: Get 360º view of an event
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 360º view of event with attendees and statistics
 */
router.get('/eventos/:id', getEvento360);

/**
 * @swagger
 * /api/vistas360/eventos:
 *   get:
 *     summary: Get 360º view of all events
 *     tags: [Vistas 360º]
 *     responses:
 *       200:
 *         description: List of 360º views
 */
router.get('/eventos', getAllEventos360);

/**
 * @swagger
 * /api/vistas360/timeline:
 *   get:
 *     summary: Get chronological timeline of all activities
 *     tags: [Vistas 360º]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: tipo_actividad
 *         schema:
 *           type: string
 *           enum: [Interaccion, Sesion, Formacion, Evento]
 *       - in: query
 *         name: empresa_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: persona_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Timeline of activities
 */
router.get('/timeline', getTimelineActividades);

/**
 * @swagger
 * /api/vistas360/estadisticas:
 *   get:
 *     summary: Get general statistics
 *     tags: [Vistas 360º]
 *     responses:
 *       200:
 *         description: General project statistics
 */
router.get('/estadisticas', getEstadisticasGenerales);

export default router;
