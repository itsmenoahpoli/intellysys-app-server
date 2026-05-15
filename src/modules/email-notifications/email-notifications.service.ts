import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { EnvVariablesConfig } from "@/config";
import { logger } from "@/utils";
import { renderAccountCreatedEmail } from "./email-notifications.templates";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type AccountCreatedEmailInput = {
  to: string;
  name?: string;
  roleName?: string;
  temporaryPassword?: string;
};

const parseBool = (value: unknown, defaultValue = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return defaultValue;
  const v = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(v)) return true;
  if (["0", "false", "no", "n", "off"].includes(v)) return false;
  return defaultValue;
};

export class EmailNotificationsService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
    null;

  private readonly enabled: boolean;
  private readonly includePassword: boolean;
  private readonly appName: string;
  private readonly dashboardUrl?: string;
  private readonly supportEmail?: string;
  private readonly from?: string;
  private readonly smtpHost?: string;
  private readonly smtpPort?: number;
  private readonly smtpSecure?: boolean;
  private readonly smtpUser?: string;
  private readonly smtpPass?: string;

  constructor() {
    const { getEnvValue } = EnvVariablesConfig;

    this.enabled = parseBool(getEnvValue<string>("EMAIL_ENABLED"), false);
    this.includePassword = parseBool(getEnvValue<string>("EMAIL_INCLUDE_PASSWORD"), false);
    this.appName = getEnvValue<string>("APP_NAME") || "Intellysys";
    this.dashboardUrl = getEnvValue<string>("DASHBOARD_URL") || undefined;
    this.supportEmail = getEnvValue<string>("EMAIL_SUPPORT") || undefined;

    this.from = getEnvValue<string>("SMTP_FROM") || undefined;
    this.smtpHost = getEnvValue<string>("SMTP_HOST") || undefined;
    this.smtpPort = Number(getEnvValue<number>("SMTP_PORT") || 587);
    this.smtpSecure = parseBool(getEnvValue<string>("SMTP_SECURE"), false);
    this.smtpUser = getEnvValue<string>("SMTP_USER") || undefined;
    this.smtpPass = getEnvValue<string>("SMTP_PASS") || undefined;
  }

  private get isConfigured() {
    return Boolean(this.smtpHost && this.from);
  }

  private getTransporter() {
    if (this.transporter) return this.transporter;

    if (!this.enabled) {
      return null;
    }

    if (!this.isConfigured) {
      logger.warn(
        `[EmailNotifications] EMAIL_ENABLED=true but SMTP is not configured (need SMTP_HOST and SMTP_FROM at minimum). Email sending disabled.`,
      );
      return null;
    }

    const transport: SMTPTransport.Options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
    };

    if (this.smtpUser && this.smtpPass) {
      transport.auth = { user: this.smtpUser, pass: this.smtpPass };
    }

    this.transporter = nodemailer.createTransport(transport);
    return this.transporter;
  }

  async sendEmail(input: SendEmailInput) {
    const transporter = this.getTransporter();
    if (!transporter) return;

    await transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  }

  async sendUserAccountCreatedEmail(input: AccountCreatedEmailInput) {
    const transporter = this.getTransporter();
    if (!transporter) return;

    const { subject, html, text } = renderAccountCreatedEmail({
      appName: this.appName,
      dashboardUrl: this.dashboardUrl,
      supportEmail: this.supportEmail,
      recipientName: input.name,
      recipientEmail: input.to,
      roleName: input.roleName,
      temporaryPassword: this.includePassword ? input.temporaryPassword : undefined,
    });

    await this.sendEmail({
      to: input.to,
      subject,
      html,
      text,
    });
  }
}

