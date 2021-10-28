import * as sgMail from '@sendgrid/mail';
import Email from '../interfaces/email.interface';

export const sendEmail = async (emailData: Email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: emailData.email,
    from: 'patrickdz96@gmail.com',
    subject: emailData.subject,
    html: emailData.body,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    //console.error(error);
    throw error;
  }
};
