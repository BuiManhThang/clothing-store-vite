import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { categoryController } from '../startup'

const categoryRouter = Router()

categoryRouter.get('/pagination', categoryController.getPagination)
categoryRouter.get('/new-code', categoryController.generateNewCode)
categoryRouter.get('/:id', categoryController.getById)
categoryRouter.get('/', categoryController.get)
categoryRouter.post('/', authorize, categoryController.create)
categoryRouter.put('/:id', authorize, categoryController.update)
categoryRouter.delete('/:id', authorize, categoryController.delete)

export default categoryRouter
