const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var crypto = require('crypto');

var config = require('./config');
var utils = require('./utils');
var sandbox = sinon.createSandbox();

describe('utils', ()=>{
    let secretStub, digestStub, updateStub, createHashStub, hash;

    beforeEach(()=>{
        secretStub = sandbox.stub(config,'secret').returns('fake_secret');
        digestStub = sandbox.stub().returns('SOmeKey');
        updateStub = sandbox.stub().returns({
            digest: digestStub
        });
        createHashStub = sandbox.stub(crypto,'createHash').returns({
            update: updateStub
        });

        hash = utils.getHash('foo');
    })

    afterEach(()=>{
        sandbox.restore();
    })

    context('get hash',()=>{
        it('should return null for invalid entry',()=>{
            sandbox.reset();
            expect(utils.getHash()).to.be.null;
            expect(utils.getHash(123)).to.be.null;
            expect(secretStub).to.not.have.been.called;
        });

        it('should get secret from config', ()=>{
            expect(secretStub).to.have.been.called;
        });
    
        it('should call crypto with correct settings and return hash', ()=>{
            expect(createHashStub).to.have.been.calledWith('md5');
            expect(updateStub).to.have.been.calledWith('foo_fake_secret');
            expect(digestStub).to.have.been.calledWith('hex');
            expect(hash).to.equal('SOmeKey');
        });
    })

})