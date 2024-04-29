import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { orderController } from '../startup'
const orderRouter = Router()
orderRouter.get('/pagination', orderController.getPagination)
orderRouter.get('/new-code', orderController.generateNewCode)
orderRouter.get('/:id', orderController.getById)
orderRouter.get('/', orderController.get)
orderRouter.post('/', authorize, orderController.create)
orderRouter.put('/:id', authorize, orderController.update)
orderRouter.delete('/:id', authorize, orderController.delete)
export default orderRouter
