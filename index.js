import 'dotenv/config.js'
import express from 'express'

import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'
import { UpdateUserController } from './src/controllers/update-user.js'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.post('/api/users', async (req, res) => {
  const createUserController = new CreateUserController()
  const { statusCode, body } = await createUserController.execute(req)

  res.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdController = new GetUserByIdController()
  const { statusCode, body } = await getUserByIdController.execute(req)

  res.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (req, res) => {
  const updateUserController = new UpdateUserController()
  const { statusCode, body } = await updateUserController.execute(req)

  res.status(statusCode).json(body)
})

app.listen(port, () => {
  console.log('listening on port ' + port)
})
