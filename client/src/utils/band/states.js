const states = {
    /**
     * Chain的所在面，表面和背面
     */
    side: {
        face: true,  //表面
        back: false  //背面
    },

    /**
     * Line的交换状态
     */
    swap: {
        unswap: false,
        swaped: true,
    },

    operation: {
        '上': {
            name: '上',
            type: '上'
        },
        '下': {
            name: '下',
            type: '下'
        },
        '刮': {
            name: '刮',
            type: '刮'
        },
        '搭': {
            name: '搭',
            type: '搭'
        },
        '不上': {
            name: '隔',
            type: '不上'
        },
        '不下': {
            name: '隔',
            type: '不下'
        },
        '不刮': {
            name: '隔',
            type: '不刮'
        },
        '不搭': {
            name: '隔',
            type: '不搭'
        },
    },
};
export default states;