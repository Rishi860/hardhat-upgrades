const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
require("dotenv").config();
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	const args = [];

	log("--------------------");
	const box = await deploy("Box", {
		from: deployer,
		args: args,
    log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
		proxy: {
			proxyContract: "OpenZeppelinTransparentProxy",
			viaAdminContract: {
				name: "BoxProxyAdmin",
				artifact: "BoxProxyAdmin",
			},
		},
	});

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		log("Verifying...");
		await verify(box.address, args);
	}
	log("-------------------");
};
