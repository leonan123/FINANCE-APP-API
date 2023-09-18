import { EmailAlreadyInUseError } from '../errors/user.js'
import {
  badRequest,
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  invalidEmailResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  ok,
  serverError,
} from './helpers/index.js'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }

  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const params = httpRequest.body

      const allowedFields = ['first_name', 'last_name', 'email', 'password']
      const someFieldsIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldsIsNotAllowed) {
        return badRequest({
          message: 'Some provided field is not allowed!',
        })
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)
        if (!passwordIsValid) {
          return invalidPasswordResponse()
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email)
        if (!emailIsValid) {
          return invalidEmailResponse()
        }
      }

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updatedUser)
    } catch (error) {
      console.log(error)

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
