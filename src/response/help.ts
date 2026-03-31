import RocoHelp from '@src/img/views/Help';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });

  const [message] = useMessage(event);

  const img = await renderComponentIsHtmlToBuffer(RocoHelp, {});

  if (typeof img === 'boolean') {
    const format = Format.create();
    const md = Format.createMarkdown();

    md.addText('[洛克王国] 帮助图片加载失败，请稍后重试');
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const format = Format.create();

  format.addImage(img);
  void message.send({ format });
};
