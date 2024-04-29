import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { receiptController } from '../startup'
const receiptRouter = Router()
receiptRouter.get('/pagination', receiptController.getPagination)
receiptRouter.get('/new-code', receiptController.generateNewCode)
receiptRouter.get('/:id', receiptController.getById)
receiptRouter.get('/', receiptController.get)
receiptRouter.post('/', authorize, receiptController.create)
receiptRouter.put('/:id', authorize, receiptController.update)
receiptRouter.delete('/:id', authorize, receiptController.delete)
export default receiptRouter
