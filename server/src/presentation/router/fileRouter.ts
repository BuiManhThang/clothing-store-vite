import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { fileController } from '../startup'
const fileRouter = Router()
fileRouter.get('/pagination', fileController.getPagination)
fileRouter.get('/:id', fileController.getById)
fileRouter.get('/', fileController.get)
fileRouter.post('/', authorize, fileController.create)
fileRouter.put('/:id', authorize, fileController.update)
fileRouter.delete('/:id', authorize, fileController.delete)
export default fileRouter
