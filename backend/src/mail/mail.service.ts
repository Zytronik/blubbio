import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private loadTemplate(templateName: string): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.html`);

    return fs.readFileSync(filePath, 'utf8');
  }

  private compileTemplate(
    template: string,
    variables: Record<string, string>,
  ): string {
    let html = template;

    Object.keys(variables).forEach((key) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    });

    return html;
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const template = this.loadTemplate('password-reset');

    const html = this.compileTemplate(template, {
      resetLink,
    });

    await this.transporter.sendMail({
      from: `"blubb.io" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }
}
