import { Router } from 'express'
import { roleController } from '../startup'
import { authorize } from '../middleware/authorization'

const roleRouter = Router()

roleRouter.get('/pagination', authorize, roleController.getPagination)
roleRouter.get('/:id', authorize, roleController.getById)
roleRouter.get('/', authorize, roleController.get)
roleRouter.post('/', authorize, roleController.create)
roleRouter.put('/:id', authorize, roleController.update)
roleRouter.delete('/:id', authorize, roleController.delete)

export default roleRouter
