import { Router } from 'express'
import { userController } from '../startup'
import { authorize, authorizeRefreshToken } from '../middleware/authorization'

const userRouter = Router()

userRouter.get('/pagination', authorize, userController.getPagination)
userRouter.get('/new-code', authorize, userController.generateNewCode)
userRouter.get('/:id', authorize, userController.getById)
userRouter.get('/', authorize, userController.get)
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/logout', authorize, userController.logout)
userRouter.post('/access-token', authorizeRefreshToken, userController.getAccessToken)
userRouter.post('/', authorize, userController.create)
userRouter.put('/:id', authorize, userController.update)
userRouter.delete('/:id', authorize, userController.delete)

export default userRouter
