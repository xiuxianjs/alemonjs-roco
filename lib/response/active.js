import ActiveDate from '../img/views/ActiveDate.js';
import { createEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var active = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage(event);
    const img = await renderComponentIsHtmlToBuffer(ActiveDate, {});
    if (typeof img === 'boolean') {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText('[洛克王国] 图片加载失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const format = Format.create();
    format.addImage(img);
    void message.send({ format });
};

export { active as default };
