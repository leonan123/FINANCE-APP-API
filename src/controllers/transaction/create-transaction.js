import {
  badRequest,
  checkIfIdIsValid,
  created,
  invalidIdResponse,
  serverError,
  validateRequiredFields,
} from '../helpers/index.js'

import validator from 'validator'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const requiredFields = ['userId', 'name', 'amount', 'type', 'date']

      const { ok: requiredFieldsWereProvided, missingFields } =
        validateRequiredFields(params, requiredFields)

      if (!requiredFieldsWereProvided) {
        return badRequest({
          message: 'Missing required fields: ' + missingFields.join(', '),
        })
      }

      const userIdIsValid = checkIfIdIsValid(params.userId)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      if (params.amount <= 0) {
        return badRequest({ message: 'Amount must be greater than 0' })
      }

      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })

      if (!amountIsValid) {
        return badRequest({ message: 'The amount must be a valid currency' })
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typeIsValid) {
        return badRequest({
          message: 'Type must be EARNING, EXPENSE or INVESTMENT',
        })
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.error(error)

      return serverError()
    }
  }
}
