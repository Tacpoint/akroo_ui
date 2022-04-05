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
    getbalance(account)
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
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => accountChangeHandler(res[0]))
    } else {
      alert('install metamask extension!!')
    }
  }
  const getbalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((balance) => {
        console.log(ethers.utils.formatEther(balance))
      })
  }
  useEffect(() => {
    console.log('AppHeader useEffect being called')
    setWalletButtonLabel('Connect Wallet')
  }, [])
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
          <CButton onClick={() => connectWallet()}>{walletButtonLabel}</CButton>
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
