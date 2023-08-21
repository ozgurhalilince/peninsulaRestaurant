import Router from '@koa/router'
import { koaBody } from 'koa-body'
import AuthController from '../controllers/AuthController'
import UserController from '../controllers/UserController'
import TableController from "../controllers/TableController";
import WorkingScheduleController from "../controllers/WorkingScheduleController";
import ReservationController from "../controllers/ReservationController";

const router = new Router()

router.post('/api/v1/auth/register', AuthController.register, koaBody())
router.post('/api/v1/auth/login', AuthController.login, koaBody())

router.get('/api/v1/users', UserController.index, koaBody())

router.get('/api/v1/tables', TableController.index)
router.post('/api/v1/tables', TableController.store, koaBody())
router.get('/api/v1/tables/:id', TableController.show)
router.put('/api/v1/tables/:id', TableController.update, koaBody())
router.del('/api/v1/tables/:id', TableController.destroy)

router.get('/api/v1/working-schedules', WorkingScheduleController.index)
router.put('/api/v1/working-schedules/:id', WorkingScheduleController.update, koaBody())

router.get('/api/v1/reservations', ReservationController.index)
router.post('/api/v1/reservations', ReservationController.store, koaBody())
router.put('/api/v1/reservations/:id', ReservationController.update, koaBody())
router.del('/api/v1/reservations/:id', ReservationController.destroy)

export default router