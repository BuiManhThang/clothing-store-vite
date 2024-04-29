import { Router } from 'express'
import { authorize } from '../middleware/authorization'
import { productController } from '../startup'

const productRouter = Router()

productRouter.get('/pagination', productController.getPagination)
productRouter.get('/new-code', productController.generateNewCode)
productRouter.get('/:id', productController.getById)
productRouter.get('/', productController.get)
productRouter.post('/', authorize, productController.create)
productRouter.put('/:id', authorize, productController.update)
productRouter.delete('/:id', authorize, productController.delete)

export default productRouter
