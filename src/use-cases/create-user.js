import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserUseCase {
  constructor(createUserRepository, getUserByEmailRepository) {
    this.createUserRepository = createUserRepository
    this.getUserByEmailRepository = getUserByEmailRepository
  }

  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createdUser = await this.createUserRepository.execute(user)

    return createdUser
  }
}
