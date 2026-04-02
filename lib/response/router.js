import { routeRules } from '../constants/roco.js';
import { defineRouter, lazy } from 'alemonjs';

var router = defineRouter([
    {
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create'],
        handler: lazy(() => import('./mw.js')),
        children: [
            {
                regular: routeRules.help,
                handler: lazy(() => import('./help.js'))
            },
            {
                regular: routeRules.petDetail,
                handler: lazy(() => import('./petDetail.js'))
            },
            {
                regular: routeRules.petList,
                handler: lazy(() => import('./petList.js'))
            },
            {
                regular: routeRules.skillSearch,
                handler: lazy(() => import('./skillSearch.js'))
            },
            {
                regular: routeRules.activeDate,
                handler: lazy(() => import('./active.js'))
            },
            {
                regular: routeRules.announcement,
                handler: lazy(() => import('./announcement.js'))
            }
        ]
    }
]);

export { router as default };
