const ENV = require('../config/env').ENV


exports.mailTrackingOptions = {
    baseUrl: `http://localhost:${ENV.SERVER_PORT}/api/${ENV.EMAIL_TRACKING_ENDPOINT}`,
    jwtSecret: 'secret',
    getData: data => {
        // recipient: { ENV.EMAIL_RECIPIENT_ADDRESS }
        // return { ...data, hello: 'world' };
        console.log('Email arrivé à bon port !')
        return {
            isRecepted: true
        }
    },
    onBlankImageView: data => {
        // console.log('Email ouvert !')
        // console.log(data)
        /* 
            When email is opened 
            data is default data + your data
        */
    },
    onLinkClick: data => {
        /* 
            When click on link in mail 
            data is default data + { link } + your data
        */
    },
}