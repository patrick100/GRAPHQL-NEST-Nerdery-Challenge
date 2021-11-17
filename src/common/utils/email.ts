import * as sgMail from '@sendgrid/mail';
import { Email } from 'src/common/interfaces/email.interface';

export const sendEmail = async (emailData: Email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send(emailData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
