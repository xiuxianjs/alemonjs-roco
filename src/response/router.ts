import { routeRules } from '@src/constants/roco';
import { defineRouter, lazy } from 'alemonjs';

/**
 * 洛克王国宠物图鉴机器人
 *
 * #roco帮助 / #rk帮助
 * #roco图鉴 迪莫
 * #roco宠物 / #洛克宠物 火
 * #roco技能 闪光冲击 *
 *
 * --- 预计新增一下功能
 * --- 来源 bilibili wiki https://wiki.biligame.com/rocom/%E9%A6%96%E9%A1%B5
 * #roco属性克制
 * #roco阵容搭配
 * #roco任务一览
 * #roco副本挑战
 * #roco精灵图鉴
 * #roco物品图鉴
 * #roco技能图鉴
 * #roco活动
 * #roco攻略
 * #roco阵容
 * #roco升级经验表
 */

export default defineRouter([
  {
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create'],
    handler: lazy(() => import('@src/response/mw')),
    children: [
      {
        regular: routeRules.help,
        handler: lazy(() => import('@src/response/help'))
      },
      {
        regular: routeRules.petDetail,
        handler: lazy(() => import('@src/response/petDetail'))
      },
      {
        regular: routeRules.petList,
        handler: lazy(() => import('@src/response/petList'))
      },
      {
        regular: routeRules.skillSearch,
        handler: lazy(() => import('@src/response/skillSearch'))
      },
      {
        regular: routeRules.activeDate,
        handler: lazy(() => import('@src/response/active'))
      },
      {
        regular: routeRules.announcement,
        handler: lazy(() => import('@src/response/announcement'))
      }
    ]
  }
]);
