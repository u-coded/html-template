// Astro Actions：フォーム送信のサーバー処理
// contact ページから呼ばれ、Zodで入力検証 → Resendでメール送信

import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'お名前を入力してください'),
      email: z.string().email('正しいメールアドレスを入力してください'),
      message: z.string().min(10, '10文字以上で入力してください'),
    }),
    handler: async (input) => {
      const { error } = await resend.emails.send({
        from: import.meta.env.MAIL_FROM,
        to: import.meta.env.MAIL_TO,
        subject: `お問い合わせ: ${input.name}`,
        text: `お名前: ${input.name}\nメールアドレス: ${input.email}\n\n${input.message}`,
        replyTo: input.email,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メール送信に失敗しました',
        });
      }

      return { success: true };
    },
  }),
};
