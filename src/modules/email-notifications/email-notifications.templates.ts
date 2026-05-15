type AccountCreatedTemplateParams = {
  appName: string;
  dashboardUrl?: string;
  supportEmail?: string;
  recipientName?: string;
  recipientEmail: string;
  roleName?: string;
  temporaryPassword?: string;
};

import pug from "pug";

export const renderAccountCreatedEmail = (params: AccountCreatedTemplateParams) => {
  const subject = `Your ${params.appName} account is ready`;
  const preheader = `An account was created for ${params.recipientEmail}. Sign in to get started.`;

  const appName = params.appName;
  const recipientName = params.recipientName?.trim() || "there";
  const recipientEmail = params.recipientEmail;
  const roleName = params.roleName?.trim() || undefined;
  const supportEmail = params.supportEmail?.trim() || undefined;
  const dashboardUrl = params.dashboardUrl?.trim() || undefined;
  const temporaryPassword = params.temporaryPassword?.trim() || undefined;

  const templatePath = `${import.meta.dir}/templates/account-created.pug`;
  const html = pug.renderFile(templatePath, {
    subject,
    preheader,
    year: new Date().getFullYear(),
    appName,
    recipientName,
    recipientEmail,
    roleName,
    supportEmail,
    dashboardUrl,
    temporaryPassword,
  });

  const textLines = [
    `Welcome, ${params.recipientName?.trim() || "there"}`,
    ``,
    `Your ${params.appName} account has been created.`,
    ``,
    `Email: ${params.recipientEmail}`,
    params.roleName?.trim() ? `Role: ${params.roleName}` : undefined,
    ``,
    dashboardUrl ? `Sign in: ${dashboardUrl}` : undefined,
    temporaryPassword ? `Temporary password: ${temporaryPassword}` : undefined,
    supportEmail ? `Support: ${supportEmail}` : undefined,
  ].filter(Boolean) as string[];

  return {
    subject,
    preheader,
    html,
    text: textLines.join("\n"),
  };
};

