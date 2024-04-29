import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { discountController } from '../startup'
const discountRouter = Router()
discountRouter.get('/pagination', discountController.getPagination)
discountRouter.get('/new-code', discountController.generateNewCode)
discountRouter.get('/:id', discountController.getById)
discountRouter.get('/', discountController.get)
discountRouter.post('/', authorize, discountController.create)
discountRouter.put('/:id', authorize, discountController.update)
discountRouter.delete('/:id', authorize, discountController.delete)
export default discountRouter
