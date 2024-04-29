import dotenv from 'dotenv'
import express, { Express, json } from 'express'
import cors from 'cors'
dotenv.config()

import { errorHandling } from './presentation/middleware/errorHandling'
import userRouter from './presentation/router/userRouter'
import roleRouter from './presentation/router/roleRouter'
import categoryRouter from './presentation/router/categoryRouter'
import productRouter from './presentation/router/productRouter'
import fileRouter from './presentation/router/fileRouter'
import discountRouter from './presentation/router/discountRouter'
import receiptRouter from './presentation/router/receiptRouter'
import orderRouter from './presentation/router/orderRouter'

const app: Express = express()
const port = process.env.PORT || 3000

app.use(json())
app.use(cors())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/roles', roleRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/files', fileRouter)
app.use('/api/v1/discounts', discountRouter)
app.use('/api/v1/receipts', receiptRouter)
app.use('/api/v1/orders', orderRouter)

app.use(errorHandling)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
