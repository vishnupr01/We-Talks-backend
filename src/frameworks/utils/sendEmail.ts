import nodemailer from 'nodemailer'

async function sendEmail(email: string,subject:string,text:string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
      
    })
    console.log(process.env.EMAIL);
    console.log("user", email);


    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text
    }
    console.log("funcition worked");
    
    const userInfo = await transporter.sendMail(mailOptions)
    console.log("sendMail", userInfo);

    return userInfo
  } catch (error) {
    throw new Error('Error in sending OTP email')
  }

}

export { sendEmail }