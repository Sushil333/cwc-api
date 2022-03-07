import nodemailer from 'nodemailer';
import fs from 'fs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhardwajsushil911@gmail.com',
    pass: 'Null-Byte@123',
  },
});

// send mail with defined transport object
const mailOptions = {
  from: 'bhardwajsushil911@gmail.com', // sender address
  to: 'sushilbhardwaj705@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  html: '<b>Hello world?</b>', // html body
};

export default async function sendMail(payload) {
  try {
    if (payload.type === 'approved') {
      fs.readFile(
        `../email-templates/${payload.type}.html`,
        'utf-8',
        (err, data) => {
          if (data) {
            let nn = data.replace(/{{ NAME }}/, payload.name);
          } else {
            console.log('no data found');
          }
        }
      );
    }

    const info = await transporter.sendMail({
      ...mailOptions,
      to: payload.to,
      html: nn,
    });
    console.log(info);
  } catch (err) {
    console.log(err);
  }
}
