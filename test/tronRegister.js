require('chai')
    .use(require('chai-as-promised'))
    .should();

const TronRegister = artifacts.require('./TronRegister.sol');

const createAddress = () => web3.eth.accounts.create().address;

contract('TronRegister', accounts => {
    it('#1 put valid address', async () => {
        const contract = await TronRegister.new();
        const tronAddress = '41928c9af0651632157ef27a2cf17ca72c575a4d21';
        const tronAddress0x = tronAddress.replace(/^41/, '0x');
        await contract.put(tronAddress0x);
    });

    it('#2 put several addresses', async () => {
        const contract = await TronRegister.new();
        await contract.put(createAddress());
        await contract.put(createAddress(), {from: accounts[1]});
    });

    it('#3 put several addresses from one address', async () => {
        const contract = await TronRegister.new();
        await contract.put(createAddress());
        await contract.put(createAddress()).should.eventually.be.rejected;
    });

    it('#4 put invalid address', async () => {
        const contract = await TronRegister.new();
        const tronAddress = '41928c9af0651632157ef27a2cf17ca72c575a4d21';
        await contract.put(tronAddress).should.eventually.be.rejected;
    });

    it('#5 double put', async () => {
        const contract = await TronRegister.new();
        const tronAddress = '41928c9af0651632157ef27a2cf17ca72c575a4d21';
        const tronAddress0x = tronAddress.replace(/^41/, '0x');
        await contract.put(tronAddress0x);
        await contract.put(tronAddress0x).should.eventually.be.rejected;
    });

    it('#6 get after put', async () => {
        const contract = await TronRegister.new();
        const tronAddress = createAddress();
        await contract.put(tronAddress);
        await contract.get(accounts[0]).should.eventually.be.equal(tronAddress);
    });

    it('#7 get several addreses after put', async () => {
        const contract = await TronRegister.new();

        for (let i = 0; i < 2; i++) {
            const tronAddress = createAddress();
            await contract.put(tronAddress, {from: accounts[i]});
            await contract.get(accounts[i]).should.eventually.be.equal(tronAddress);
        }
    });

    it('#8 get unregistered address', async () => {
        const contract = await TronRegister.new();
        const tronAddress1 = createAddress();
        await contract.put(tronAddress1);

        const tronAddress2 = createAddress();
        await contract.get(tronAddress2).should.eventually.be.equal('0x0000000000000000000000000000000000000000');
    });
});
