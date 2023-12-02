import { UserNotFoundError } from '../../errors/user'

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const transactions =
      await this.getTransactionsByUserIdRepository.execute(userId)

    return transactions
  }
}
