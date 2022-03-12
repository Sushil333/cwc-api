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
        html: `
        <p> Hii ${payload.firstName} ${payload.lastName},
        <br />
        Congratulations, We have verified your <b>${payload.storeName}</b> store. Use the following credentials to access your store dashboard on https://cwc-dashboard.netlify.app .
        <br />

        email: ${payload.to}
        <br />
        password: ${payload.password}
        <br />

        Thanks and Regards, 
        <br />
        Cooked With Care
        </p>
      `,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
