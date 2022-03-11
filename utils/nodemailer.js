import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhardwajsushil911@gmail.com',
    pass: 'Null-Byte@123',
  },
});

// send mail with defined transport object
// const mailOptions = {
//   from: 'bhardwajsushil911@gmail.com', // sender address
//   to: 'sushilbhardwaj705@gmail.com', // list of receivers
//   subject: 'Hello ✔', // Subject line
//   html: '<b>Hello world?</b>', // html body
// };

export default async function sendMail(payload) {
  if (payload.type === 'approved') {
    try {
      await transporter.sendMail({
        from: 'bhardwajsushil911@gmail.com',
        to: payload.to,
        subject: 'Hello ✔',
        text: `
          Hii ${payload.firstName} ${payload.latName},
          Congratulations, We have verified your ${payload.storeName} store. Use following credential to access your store dashboard on https://cwc-dashboard.netlify.app .
          
          email: ${payload.to}
          password: ${payload.password}

          Thanks and Regards,
          Cooked With Care
      `,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
