const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
  sendGrid.send({
    to : email,
    from : 'bishtdeepanshu007@gmail.com',
    subject : 'Thanks for joining in !',
    text : 'Welcome to the app , ' + name
  })
}

const sendCancellationEmail = (email,name)=>{
   sendGrid.send({
     to : email , 
     from : 'bishtdeepanshu007@gmail.com',
     subject : 'Regarding your cancellation',
     text : 'As per our records you left our platform. Can you share us your feedback ('+email +' , '+ name + ')' 
   })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}