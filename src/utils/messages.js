/*jshint esversion: 6 */
/*jshint esversion: 7 */
/*jshint esversion: 8 */
/* jshint -W097 */
/* jshint -W117 */
'use strict';

const generateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocationMessage = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};