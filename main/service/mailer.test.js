const chai = require('chai');
const expect= chai.expect;
const chaiAspromised = require('chai-as-promised');
chai.use(chaiAspromised);
const sinon = require('sinon'); //mock the method
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const rewire = require('rewire'); 
let mailer = rewire('./mailer');
var sandbox = sinon.createSandbox();

describe('mailer util',()=>{

    let emailStub;

    beforeEach(()=>{
        emailStub = sandbox.stub().resolves('done');
        mailer.__set__('sendEmail', emailStub);
    })

    context('welcome mail', ()=>{
        it('should give error for invalid entry',()=>{
            expect(mailer.sendWelcomeEmail('abc@so.in')).to.eventually.be.rejectedWith('Invalid input');
            expect(mailer.sendWelcomeEmail(null,'reena')).to.eventually.be.rejectedWith('Invalid input');
        })

        it('should send welcome mail', async ()=>{
           await mailer.sendWelcomeEmail('abc@so.in','reena');
           expect(emailStub).to.have.been.calledOnceWith('abc@so.in','Dear reena, welcome to our family!');
        })
    })

    context('reset password mail', ()=>{
        it('should give error for invalid entry',()=>{
            expect(mailer.sendPasswordResetEmail('')).to.eventually.be.rejectedWith('Invalid input');
        })

        it('should send reset password mail', async ()=>{
            await mailer.sendPasswordResetEmail('abc@so.in');
            expect(emailStub).to.have.been.calledOnceWith('abc@so.in','Please click http://some_link to reset your password.');
         })
    })

    context('send mail private method', ()=>{

        let sendEmail;

        beforeEach(()=>{
             mailer = rewire('./mailer');
             sendEmail = mailer.__get__('sendEmail');
        })

        it('should give error for invalid entry',()=>{
            expect(sendEmail()).to.eventually.be.rejectedWith('Invalid input');
        })

        it('should send mail', async ()=>{
            let result = await(sendEmail('fake email','body'));
            expect(result).to.equal('Email sent');
         })
    })
});