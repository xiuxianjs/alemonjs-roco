import { findPetByName } from '../data/index.js';
import PetDetailCard from '../img/views/PetDetailCard.js';
import { createEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var petDetail = async (e) => {
    const event = createEvent({
        event: e,
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage(event);
    const text = event.MessageText?.trim() ?? '';
    const format = Format.create();
    const md = Format.createMarkdown();
    const petName = text.replace(/^[!！/#＃](?:roco|洛克)(?:图鉴|查询|cw)\s*/, '').trim();
    if (!petName) {
        md.addText('[洛克王国] 请输入宠物名，例如: #洛克图鉴 迪莫');
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const pet = findPetByName(petName);
    if (!pet) {
        md.addText(`[洛克王国] 未找到宠物「${petName}」，请检查名称是否正确`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const img = await renderComponentIsHtmlToBuffer(PetDetailCard, {
        data: { pet }
    });
    if (typeof img === 'boolean') {
        md.addText('[洛克王国] 图鉴卡片渲染失败');
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    format.addImage(img);
    void message.send({ format });
};

export { petDetail as default };
