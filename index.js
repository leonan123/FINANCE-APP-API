import 'dotenv/config.js'
import express from 'express'

import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js'
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { CreateUserUseCase } from './src/use-cases/create-user.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js'
import { UpdateUserUseCase } from './src/use-cases/update-user.js'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(req)

  res.status(statusCode).json(body)
})

app.post('/api/users', async (req, res) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const createUserRepository = new PostgresCreateUserRepository()
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
  )
  const createUserController = new CreateUserController(createUserUseCase)

  const { statusCode, body } = await createUserController.execute(req)

  res.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (req, res) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const updateUserRepository = new PostgresUpdateUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByEmailRepository,
  )
  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.execute(req)

  res.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserController = new DeleteUserController()
  const { statusCode, body } = await deleteUserController.execute(req)

  res.status(statusCode).json(body)
})

app.listen(port, () => {
  console.log('listening on port ' + port)
})
