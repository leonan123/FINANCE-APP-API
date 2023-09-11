import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from './helpers/index.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const getUserByIdUseCase = new GetUserByIdUseCase()
      const user = await getUserByIdUseCase.execute(userId)

      if (!user) {
        return userNotFoundResponse()
      }

      return ok(user)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
