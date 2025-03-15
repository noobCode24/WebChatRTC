import bcrypt from 'bcrypt'

const saltRounds = 10

export async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (err) {
    console.error(err)
  }
}

export async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (err) {
    console.error(err)
  }
}
