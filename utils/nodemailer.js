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
        Hii there,
        Congratulations, We have verified your store.
      `,
      });
    } catch (err) {
      console.log(err);
    }
  }
}