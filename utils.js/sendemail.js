const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendmail = (user,url,reason) => {
    if(process.env.NODE_ENV === 'production'){
        sendmailprod(user,url,reason)
    } else if(process.env.NODE_ENV === 'development'){
        sendmaildev(user,url,reason);
    }
}

const sendmailprod = (user,url,reason)=>{
    if(reason==='verifyemail'){
        sendverifyemailprod(user,url);
    } else if (reason==='forgotpassword')
        sendforgotpasswordemailprod(user,url);

    
}

const  sendmaildev = (user,url,reason)=>{

};





const sendverifyemailprod = (user,url)=>{
    console.log(user.email)
    //Sib(send email seninblue) configuration
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    
    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY_SENDINBLUE;
    
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
   
    const sender = {
        email: process.env.EMAIL_EMAIL_FROM,
        name: process.env.EMAIL_NAME_FROM,
    }
    
    const receivers = [
        {
            email: `${user.email}`
        }
    ]
    
    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'CONFIRMATION EMAIL',
        textContent: `
        Hello,${user.name},Thanks for signup into our shop, confirm your account for buy joining the next link
        `,
        htmlContent: `
        <h1> Hello,${user.name},</h1>
        <h2> Thanks for signup into our shop, confirm your account for buy joining the next link </h2>
        <h3>Go into this link for confirm the email</h3>
        <a href="${url}">Visit</a>
                `,
        params: {
            role: 'Frontend',
        },
    })
    .then(console.log)
    .catch(console.log)
};

const sendforgotpasswordemailprod = (user,url) => {
    console.log(url)
    //Sib(send email seninblue) configuration
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    
    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY_SENDINBLUE;
    
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
   
    const sender = {
        email: process.env.EMAIL_EMAIL_FROM,
        name: process.env.EMAIL_NAME_FROM,
    }
    
    const receivers = [
        {
            email: `${user.email}`
        }
    ]
    
    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'RESET PASSWORD EMAIL',
        textContent: `
        Hello,${user.name}, enter to the next link for reset your password
        `,
        htmlContent: `
        <h1> Hello,${user.name},</h1>
        <h2> enter to the next link for reset your password, PLEASE dont share this link to anyone or someone could steal your account </h2>
        <h2> you have 10 mins for reset your password with this link, after it will expire </h2>
        <a href="${url}">Reset Password Link</a>
                `,
        params: {
            role: 'Frontend',
        },
    })
    .then(console.log)
    .catch(console.log)
}