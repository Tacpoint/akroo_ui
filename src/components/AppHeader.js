import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CButton,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'

import { ethers } from 'ethers'
import { loans } from 'src/contracts/loans'

const AppHeader = () => {
  const [walletButtonLabel, setWalletButtonLabel] = useState()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [data, setdata] = useState({
    address: '',
    Balance: null,
  })
  const accountChangeHandler = (account) => {
    // Setting an address data
    console.log(account)
    setdata({
      address: account,
    })
    console.log('About to get balance for account : ', account)
    getBalance(account)
    let abreviatedAccount = account.slice(0, 6)
    abreviatedAccount = abreviatedAccount.concat('...')
    abreviatedAccount = abreviatedAccount.concat(account.slice(account.length - 4, account.length))
    setWalletButtonLabel(abreviatedAccount)
  }
  const connectWallet = () => {
    console.log('wallet connection logic')
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      // eth_requestAccounts replaces provider.enable - https://eips.ethereum.org/EIPS/eip-1102
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => accountChangeHandler(res[0]))
    } else {
      alert('install metamask extension!!')
    }
  }
  const getBalance = (address) => {
    // Requesting balance method
    console.log('getBalance for address : ', address)
    window.ethereum
      .request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((balance) => {
        console.log('Balance : ', balance)
        console.log(ethers.utils.formatEther(balance))
      })
      .catch((error) => {
        console.log('Error retrieving balance : ', error)
      })
      .finally(() => {
        console.log('getBalance finally method complete')
      })
  }
  const checkIfConnected = (accounts) => {
    if (!accounts) {
      //if (accounts.length === 0) {
      setWalletButtonLabel('Connect Wallet')
    } else {
      connectWallet()
    }
  }
  useEffect(() => {
    console.log('AppHeader useEffect being called')
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((res) => checkIfConnected(res[0]))
      //getBlockNumber()
    }

    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      console.log('userAddress : ', userAddress)
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)
      const userWbtcVaultFunds = await loanContract.UserTotalVaultFunds(userAddress, loans.WBTC_ADDRESS)
      console.log('WBTC vault funds balance for account : ',userAddress,' - ', userWbtcVaultFunds.toString())
      /*
      //const tx = await loanContract.addLenderSecret("0xb7e0f0242565e343e771dd746407879723d0cdca4ea5e639288680d9b2029172",{from:userAddress})
      //const tx = await loanContract.addLenderBtcPubKey("903273c4fae8c9e62199e7ee1066c83c95b348eea93b93545bdfe404b952104b",{from:userAddress});
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      */

    })()

  }, [])
  const getBlockNumber = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      let currentBlock = await provider.getBlockNumber()
      console.log('Current block : ', currentBlock)
    }
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Borrow</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Lend</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <CButton ocolor="primary" variant="outline" onClick={() => connectWallet()}>
            {walletButtonLabel}
          </CButton>
          {/* 
          <CNavLink href="#" onClick={() => connectWallet()} >Connect Wallet</CNavLink>
          <AppHeaderDropdown />
          */}
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
