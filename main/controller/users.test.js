const chai = require('chai');
const expect = chai.expect;
const chaiAspromised = require('chai-as-promised');
chai.use(chaiAspromised);
const sinon = require('sinon'); //mock the method
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire'); //craeting a fake class
const mailer = require('../service/mailer');

var mongoose = require('mongoose');
var users = rewire('./users');
var User = require('../models/user');
const { assert } = require('chai');

var sandbox = sinon.createSandbox();

describe('users', ()=>{
    let findStub;
    let deleteStub;
    let sampleUser;

    beforeEach(()=>{
        sampleUser = {
            id: 123,
            name: 'foo',
            email:'foo@bar.com',
            save: sandbox.stub().resolves()
        }

        findStub = sandbox.stub(mongoose.Model,'findById').resolves(sampleUser);
        deleteStub = sandbox.stub(mongoose.Model,'remove').resolves("fake result");
    })

    afterEach(()=>{
        sandbox.restore();
        users = rewire('./users');
    })

    context('get the user', () =>{
        it('should check for an id',(done)=>{
            users.get(null, (err, result)=>{
                expect(err).to.exist;
                expect(err.message).to.equal('Invalid user id');
                done();
            })
        });

        it('should call findUserById with id and return result',(done)=>{
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model,'findById').yields(null, sampleUser);
            users.get(123, (err, result)=>{
                expect(err).to.not.exist;
                expect(stub).to.have.been.calledOnce;
                expect(stub).to.have.been.calledOnceWith(123);
                expect(result).to.have.property('name').to.equal('foo');
                done();
            })
        });

        it('should handle the error', (done)=>{
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model,'findById').yields(new Error("no data"), null);
            users.get(123, (err, result)=>{
                expect(err).to.exist;
                expect(stub).to.have.been.calledOnce;
                expect(stub).to.have.been.calledOnceWith(123);
                expect(result).to.not.exist;
                expect(err.message).to.equal('no data');
                done();
            })
        });

    });

    context('delete user',()=>{
        it('should delete a user with id ', ()=>{
            users.delete(12).then((result)=>{
                expect(deleteStub).to.have.been.calledOnce;
                expect(deleteStub).to.have.been.calledOnceWith({_id:12});
                expect(result).to.equal('fake result');
            })
        })

        it('should throw an error', ()=>{
            users.delete(null).then(()=>{
               
            }).catch((err)=>{
                expect(err).to.exist;
                expect(deleteStub).to.have.not.been.calledOnce;
                expect(err.message).to.equal('Invalid id')
            })
        })

        it('should chk for an error using eventually', ()=>{
            return expect(users.delete(null)).to.eventually.be.rejectedWith('Invalid id');
        });
    });

    context('Create User', ()=>{
        let fakeUserClass, saveStub,result, mailerStub;

        beforeEach(()=>{
            saveStub = sandbox.stub().resolves(sampleUser);
            fakeUserClass = sandbox.stub().returns({save:saveStub});
            mailerStub = sandbox.stub(mailer,'sendWelcomeEmail').resolves("fake email");

            users.__set__('User', fakeUserClass);
        })

        it('should chk for invalid arguments', async ()=>{
            await expect(users.create(null)).to.eventually.be.rejectedWith('Invalid arguments');
            await expect(users.create({name:"Reena"})).to.eventually.be.rejectedWith('Invalid arguments');
            await expect(users.create({email:"abc@some.com"})).to.eventually.be.rejectedWith('Invalid arguments');
        });

        it('Should call user with new', async()=>{
            result = await users.create(sampleUser);
            expect(fakeUserClass).to.have.been.calledWithNew;
            expect(fakeUserClass).to.have.been.calledWith(sampleUser);
        });

        it('Should save the user',async()=>{
            result = await users.create(sampleUser);
            expect(saveStub).to.have.been.called;
        });

        it('should call the mailer with name and email',async()=>{
            result = await users.create(sampleUser);
            expect(mailerStub).to.have.been.calledWith(sampleUser.email,sampleUser.name);
        });

        it('should reject the save',async()=>{
            saveStub.rejects(new Error('fake'));
            expect(users.create(sampleUser)).to.eventually.be.rejectedWith('fake');
        });

    });

    context('Update user', ()=>{
        it('should find user by id', async() =>{
           await users.update(123, {name:"fake"});
           expect(findStub).to.have.been.calledWith(123);
        })

        it('should update user and save', async() =>{
            let result = await users.update(123, {name:"fake"});
            expect(sampleUser.save).to.have.been.calledOnce;
         })

         it('should throw error', () =>{
            findStub.rejects(new Error('fake'));
            expect(users.update(123, sampleUser)).to.eventually.be.rejectedWith('fake');
         })

    })

    context('reset password', ()=>{

         it('should throw error when no email', () =>{
            expect(users.resetPassword(null)).to.eventually.be.rejectedWith('Invalid email');
         })

        it('should reset password', async() =>{
           let mailerStub = sandbox.stub(mailer,'sendPasswordResetEmail').resolves("fake email");
           let result = await users.resetPassword('abc@some.com');
           expect(mailerStub).to.have.been.calledWith('abc@some.com');
           expect(result).to.equal('fake email');
        })

    })
})