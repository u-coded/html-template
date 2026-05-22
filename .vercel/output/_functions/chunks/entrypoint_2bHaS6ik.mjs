import './server_CfOQhyj_.mjs';
import * as z from 'zod/v4';
import { Resend } from 'resend';
import { d as defineAction, A as ActionError } from './entrypoint_CklKpU-T.mjs';

const resend = new Resend("re_xxxxxxxxxxxx");
const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1, "お名前を入力してください"),
      email: z.string().email("正しいメールアドレスを入力してください"),
      message: z.string().min(10, "10文字以上で入力してください")
    }),
    handler: async (input) => {
      const { error } = await resend.emails.send({
        from: undefined                         ,
        to: undefined                       ,
        subject: `お問い合わせ: ${input.name}`,
        text: `お名前: ${input.name}
メールアドレス: ${input.email}

${input.message}`,
        replyTo: input.email
      });
      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "メール送信に失敗しました"
        });
      }
      return { success: true };
    }
  })
};

export { server };
