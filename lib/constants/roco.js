const routeRules = {
    help: /^(?:!|！|\/|#|＃)(?:roco|洛克)(帮助|help)$/,
    petDetail: /^(?:!|！|\/|#|＃)(?:roco|洛克)(图鉴|查询|cw)\s+(.+)$/,
    petList: /^(?:!|！|\/|#|＃)(?:roco|洛克)(宠物|宠物列表|精灵|cwlb)(?:\s+(.+))?$/,
    skillSearch: /^(?:!|！|\/|#|＃)(?:roco|洛克)(技能|jn)\s+(.+)$/,
    elementSearch: /^(?:!|！|\/|#|＃)(?:roco|洛克)(属性|sx)\s+(.+)$/,
    activeDate: /^(?:!|！|\/|#|＃)(?:roco|洛克)(活动|日历|hdrl)$/,
    announcement: /^(?:!|！|\/|#|＃)(?:roco|洛克)公告(?:\s+(.+))?$/
};

export { routeRules };
