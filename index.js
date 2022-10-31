import { ethers } from "./ethers-5.6.esm.min.js"
import { ContractAddress, abi } from "./constants.js"

const connectbutton = document.getElementById("connectbutton")
const balancebutton = document.getElementById("balancebutton")
const fundbuttton = document.getElementById("fundbutton")
const withdrawbutton = document.getElementById("withdrawbutton")
connectbutton.onclick = connect
balancebutton.onclick = getbalance
fundbuttton.onclick = fund
withdrawbutton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" })
        connectbutton.innerHTML = "connected"
        console.log("connected to metamask!")
    } else {
        console.log("please install web3provider extension..")
    }
}
async function getbalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(ContractAddress)
            balancebutton.innerHTML = ethers.utils.formatEther(balance)
        } catch (error) {
            console.log(error)
        }
    } else {
        balanceButton.innerHTML = "Please install MetaMask"
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethamount").value
    console.log(`Funding ${ethAmount} ether`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signers = provider.getSigner()
        const contract = new ethers.Contract(ContractAddress, abi, signers)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenerForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("please install web3provider extension..")
    }
}
async function withdraw() {
    console.log("withdrawing...")
    const ethAmount = document.getElementById("ethamount").value
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signers = provider.getSigner()
        const contract = new ethers.Contract(ContractAddress, abi, signers)
        try {
            const transactionResponse = await contract.withdraw()
            await listenerForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("please install web3provider extension..")
    }
}
function listenerForTransactionMine(transactionResponse, provider) {
    console.log(`listening for Transaction Receipt at ${transactionResponse.hash}..`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}
