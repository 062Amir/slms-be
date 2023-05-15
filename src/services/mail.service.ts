import * as nodemailer from "nodemailer";
import { IUser } from "../interfaces/user.interface";
import * as dotenv from "dotenv";
import {
  getAccountActivateTemplate,
  getAccountCreatedTemplate,
  getAccountRegisteredTemplate,
  getResetPasswordTemplate,
} from "../templates/email.template";
import { AppDefaults, AppMessages } from "../data/app.constants";
dotenv.config();

let config = {
  service: AppDefaults.EMAIL_SERVICE as string,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASS,
  },
};

let transporter = nodemailer.createTransport(config);

const message = {
  from: process.env.SENDER_EMAIL,
  to: "",
  subject: "",
  html: "",
};

const sendAccountActivationMail = async (userInfo: IUser): Promise<boolean> => {
  message.to = userInfo.email;
  message.subject = AppMessages.ACCOUNT_ACTIVATION_MAIL_SUBJECT;
  message.html = getAccountActivateTemplate(userInfo.name);
  await transporter.sendMail(message);
  return true;
};

const sendAccountRegisteredMail = async (userInfo: IUser): Promise<boolean> => {
  message.to = userInfo.email;
  message.subject = AppMessages.ACCOUNT_REGISTERED_MAIL_SUBJECT;
  message.html = getAccountRegisteredTemplate(userInfo.name);
  await transporter.sendMail(message);
  return true;
};

const sendAccountCreatedMail = async (userInfo: IUser): Promise<boolean> => {
  message.to = userInfo.email;
  message.subject = AppMessages.ACCOUNT_CREATED_MAIL_SUBJECT;
  message.html = getAccountCreatedTemplate(userInfo);
  await transporter.sendMail(message);
  return true;
};

const sendResetPasswordMail = async (userInfo: IUser, link: string): Promise<boolean> => {
  message.to = userInfo.email;
  message.subject = AppMessages.ACCOUNT_RESET_PASS_MAIL_SUBJECT;
  message.html = getResetPasswordTemplate(userInfo, link);
  await transporter.sendMail(message);
  return true;
};

export { sendAccountActivationMail, sendAccountRegisteredMail, sendAccountCreatedMail, sendResetPasswordMail };
