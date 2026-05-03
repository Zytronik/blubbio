import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

const templatesDir = join(
  __dirname,
  '..',
  '..',
  process.env.NODE_ENV === 'development' ? 'src' : 'dist',
  'mailer',
  'templates',
);

function toBoolean(envVarValue: string): boolean {
  return envVarValue === 'true'; // Returns true if envVarValue is exactly the string 'true'
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: toBoolean(configService.get<string>('MAIL_SECURE')), // true for 465, false for other ports
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from:
            '"blubb.io Support" <' +
            configService.get<string>('MAIL_USER') +
            '>',
        },
        template: {
          dir: templatesDir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
