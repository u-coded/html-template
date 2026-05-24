// Astro Actions：フォーム送信のサーバー処理
// contact ページから呼ばれ、Zodで入力検証 → Resendでメール送信

import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'お名前を入力してください'),
      email: z.email('正しいメールアドレスを入力してください'),
      message: z.string().min(10, '10文字以上で入力してください'),
    }),
    handler: async (input) => {
      // 1通目：管理者宛
      const { error: adminError } = await resend.emails.send({
        from: import.meta.env.MAIL_FROM,
        to: import.meta.env.MAIL_TO,
        subject: `【お問い合わせ】${input.name}様より`,
        text: [
          'Webサイトのお問い合わせフォームから連絡がありました。',
          '',
          '----------------------------------------',
          `お名前: ${input.name}`,
          `メールアドレス: ${input.email}`,
          '----------------------------------------',
          '',
          '【お問い合わせ内容】',
          input.message,
        ].join('\n'),
        replyTo: input.email,
      });

      if (adminError) {
        console.error('[Resend admin mail error]', adminError);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `メール送信に失敗しました: ${adminError.message ?? adminError.name ?? 'unknown'}`,
        });
      }

      // 2通目：送信者への自動返信
      const { error: autoReplyError } = await resend.emails.send({
        from: import.meta.env.MAIL_FROM,
        to: input.email,
        subject: 'お問い合わせを受け付けました',
        text: [
          `${input.name} 様`,
          '',
          'この度はお問い合わせいただき、誠にありがとうございます。',
          '下記の内容で受け付けました。',
          '担当者より折り返しご連絡いたしますので、今しばらくお待ちください。',
          '',
          '※本メールは自動送信です。このメールに返信いただいてもお答えできません。',
          '',
          '----------------------------------------',
          '【お問い合わせ内容】',
          input.message,
          '----------------------------------------',
        ].join('\n'),
      });

      // 自動返信失敗は致命傷ではないのでログのみ
      if (autoReplyError) {
        console.error('[Resend auto-reply error]', autoReplyError);
      }

      return { success: true };
    },
  }),
};
