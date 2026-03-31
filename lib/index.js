import router from './response/router.js';

var index = defineChildren({
    register() {
        return {
            responseRouter: router
        };
    },
    onCreated() {
        logger.info('洛克王国助手 Server Done');
    }
});

export { index as default };
