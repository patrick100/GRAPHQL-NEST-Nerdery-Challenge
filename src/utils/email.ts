import * as sgMail from '@sendgrid/mail';
import { Email, EmailLowCost } from 'src/interfaces/email.interface';

export const sendEmail = async (emailData: Email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: emailData.email,
    from: process.env.SENDER_EMAIL,
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

// TODO Merge in one function
export const sendEmailLowCost = async (emailData: EmailLowCost) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send(emailData);
  } catch (error) {
    //console.error(error);
    throw error;
  }
};
