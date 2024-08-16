export function generateOTP(length: number) {
  const characters = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length)
    otp += characters[index]
  }
  return otp
}