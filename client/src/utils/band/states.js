const side = {
    face: true,  //表面
    back: false  //背面
};

const swap = {
    unswap: false,
    swaped: true,
};

const states = {
    /**
     * Chain的所在面，表面和背面
     */
    side: side,

    /**
     * Line的交换状态
     */
    swap: swap,

    operation: {
        '上': {
            name: '上',
            type: '上',
            swap: swap.unswap,
            side: side.back,
            visible: true,
        },
        '下': {
            name: '下',
            type: '下',
            swap: swap.unswap,
            side: side.face,
            visible: false,
        },
        '刮': {
            name: '刮',
            type: '刮',
            swap: swap.swaped,
            side: side.back,
            visible: false,
        },
        '搭': {
            name: '搭',
            type: '搭',
            swap: swap.swaped,
            side: side.face,
            visible: true,
        },
        '不上': {
            name: '隔',
            type: '不上',
        },
        '不下': {
            name: '隔',
            type: '不下',
        },
        '不刮': {
            name: '隔',
            type: '不刮',
        },
        '不搭': {
            name: '隔',
            type: '不搭',
        }
    },
};
console.log(states);
export default states;