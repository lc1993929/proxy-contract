const {expect} = require("chai");
const {ethers} = require("hardhat");
const hre = require("hardhat");

describe("ERC721 Upgradeable", function () {
    it("Should deploy an upgradeable ERC721 Contract", async function () {
        const LW3NFT = await ethers.getContractFactory("LW3NFT");
        const LW3NFT2 = await ethers.getContractFactory("LW3NFT2");

        let beacon = await hre.upgrades.deployBeacon(LW3NFT);
        let proxyContract = await hre.upgrades.deployBeaconProxy(beacon, LW3NFT);
        const [owner] = await ethers.getSigners();
        const ownerOfToken1 = await proxyContract.ownerOf(1);

        expect(ownerOfToken1).to.equal(owner.address);

        await hre.upgrades.upgradeBeacon(beacon, LW3NFT2);
        proxyContract = LW3NFT2.attach(proxyContract.address);
        expect(await proxyContract.test()).to.equal("upgraded");
    });
});