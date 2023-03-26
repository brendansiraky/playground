import Blockfrost from '@blockfrost/blockfrost-js'
import * as dotenv from 'dotenv'
dotenv.config()

const API = new Blockfrost.BlockFrostAPI({
    projectId: process.env.BLOCKFROST_API_KEY_MAINNET,
    network: 'mainnet',
})

const getAssetsByPolicyId = async (policy, page = 1) => {
    try {
        const assets = await API.assetsPolicyById(policy, {
            page
        })
        return assets
    } catch (error) {
        console.error(error)
    }
}

const getAddressFromHandle = async (handleName) => {
    if (!handleName || !handleName.includes('$')) {
        throw new Error('Please use a valid handle.. E.G $siraky')
    }

    const handlePolicyId = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
    try {
        const assetName = Buffer.from(handleName.slice(1)).toString('hex');
        const asset = await API.assetsAddresses(`${handlePolicyId}${assetName}`)
        return asset[0].address
    } catch (err) {
        console.error(`getAddressByHandle err - ${err}`)
    }
}

const getBalance = async (address) => {
    try {
        const result = await API.addresses(address)
        const balanceInLovelace = result.amount[0].quantity
        const balanceInAda = balanceInLovelace / 1000000
        return balanceInAda
    } catch (err) {
        console.error(`getBalanceByAddress err - ${err}`)
    }
}

const STAG_ALLIANCE_POLICY_ID = '1fcf4baf8e7465504e115dcea4db6da1f7bed335f2a672e44ec3f94e'
const ADDRESS = 'addr1qxfvr0wsqmn0frwr0d6rahpsd04deu4e22vgfxvmk8wpzs6k6e6kwetg9ku9dgz52kl3xwyfctsgu0v2cfr6d0xwmcgslftyjl'
const HANDLE = '$siraky'

// getAssetsByPolicyId(STAG_ALLIANCE_POLICY_ID).then(console.log)
getAddressFromHandle(HANDLE).then(console.log)
getBalance(ADDRESS).then(console.log)