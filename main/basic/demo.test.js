const chai = require('chai');
const expect = chai.expect;
const chaiAspromised = require('chai-as-promised');
chai.use(chaiAspromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire'); //to spy private method

//var demo = require('./demo');
var demo = rewire('./demo');

describe('demo',()=>{
    context('add',()=>{
        it('should add 2 number',()=>{
            expect(demo.add(1,2)).to.equal(3);
        })
    })

    context('callabck add',()=>{
        it('should chk callback',(done)=>{
            demo.addCallback(1,2, (err, res)=>{
                expect(err).to.be.null;
                expect(res).to.equal(3);
                done();
            })
        })
    })


    context('promise test',()=>{
        it('should add to prmise',(done)=>{
            demo.addPromise(1,2).then((result)=>{
                expect(result).to.be.equal(3);
                done();
            }).catch((ex)=>{
                //console.log(ex);
                done(ex);
            })
        })
        it('should test a promise with return',()=>{
            return demo.addPromise(1,2).then((result)=>{
                expect(result).to.be.equal(3); 
            })
        })

        it('should test a promise with async await', async ()=>{
            let result = await demo.addPromise(1,2);
            expect(result).to.equal(3);
        })

        it('should test promise with chai as promised', async ()=>{
            await expect(demo.addPromise(1,2)).to.eventually.equal(3);
        })

    });

    context('doubles / spy test', ()=>{
        it('should spy on console.log', ()=>{
            let spy = sinon.spy(console,'log');
            demo.foo();

            expect(spy.calledOnce).to.be.true;
            expect(spy).to.have.been.calledOnce;
            spy.restore();
        })

        it('should stub console.warn',()=>{
            let stub = sinon.stub(console, 'warn');

            demo.foo();
            expect(stub).to.have.been.calledOnce;
            stub.restore();
        })

        it('should stub console.warn and call fake function',()=>{
            let stub = sinon.stub(console, 'warn').callsFake(()=>{
                console.log('message from spy fake');
            });

            demo.foo();
            expect(stub).to.have.been.calledOnce;
            expect(stub).to.have.been.calledWith('console warn called');
            stub.restore();
        })
    })

    context('stub private functions', ()=>{
        it('should stub craeteFile', async ()=>{
            let createStub = sinon.stub(demo,'createFile')
                            .resolves('craete_stub');
            let callStub = sinon.stub().resolves('call_dbstub');

            demo.__set__('callDB', callStub);

            let result = await demo.bar('test.txt');
            expect(result).to.equal('call_dbstub');
            expect(createStub).to.have.been.calledOnceWith('test.txt');
        })
    })


})

