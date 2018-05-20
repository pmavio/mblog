const states = {
    /**
     * Chain的奇偶性
     */
    parity: {
        odd: true,  //奇数
        eve: false  //偶数
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