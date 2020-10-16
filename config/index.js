'use strict';

module.exports = {
    port: process.env.PORT || 8000,
    database: 'mongodb://localhost:27017/segumiento-ligas',
    jwt: {
        secretKey: 'K{RYHwN.WC-BBxe{]AD9,CCH%02[4Yn5A%I*?4106r}kP%ySfJ%Pu?u@E,)wh:8',
        expireTime: `${Number.MAX_SAFE_INTEGER}d`
    },
    Socket:{}
};