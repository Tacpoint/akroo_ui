import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import {
  CImage,
  CButton,
  CFormSelect,
  CButtonGroup,
  CCard,
  CForm,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CFormText,
  CFormCheck,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import wbtclogo from 'src/assets/images/wrapped-bitcoin.png'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

import { ethers } from 'ethers'
import { loans } from 'src/contracts/loans'
import { wbtc } from 'src/contracts/wbtc'

const RequestLoan = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcOnDeposit, setWbtcOnDeposit] = useState()
  const [wbtcAuthorized, setWbtcAuthorized] = useState()
  const [wbtcBalance, setWbtcBalance] = useState()
  const navigate = useNavigate();

  const handleLoanRequest = async () => {

    navigate('/rbtcdeposit', { replace: true });

    
    /*
    const depositAmt = document.querySelector('#wbtcAmt');
    console.log('deposit amt : ', depositAmt.value)

    //console.log(util.inspect(depositAmt))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      let bn = ethers.BigNumber.from(depositAmt.value)
      const tx = await loanContract.deposit(loans.WBTC_ADDRESS, bn, {from:userAddress})
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      const userWbtcVaultFunds = await loanContract.UserTotalVaultFunds(userAddress, loans.WBTC_ADDRESS)
      setWbtcOnDeposit(userWbtcVaultFunds.toString())

      const wbtcContract = new ethers.Contract(loans.WBTC_ADDRESS, wbtc.abi, signer)
      const wbtcAuthAmt = await wbtcContract.allowance(userAddress, loans.LOAN_ADDRESS)
      const wbtcBalance = await wbtcContract.balanceOf(userAddress)
      setWbtcBalance(wbtcBalance.toString())
      setWbtcAuthorized(wbtcAuthAmt.toString())

    }
    catch (err) {
      alert(err)
    }
    */

  }

  useEffect(() => {
    console.log('AppHeader useEffect being called')
    if (!window.ethereum) {
      alert('Please connect wallet!')
    }

    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)
      const userWbtcVaultFunds = await loanContract.UserTotalVaultFunds(userAddress, loans.WBTC_ADDRESS)
      console.log('WBTCDeposit - WBTC vault funds balance for account : ',userAddress,' - ', userWbtcVaultFunds.toString())
      setWbtcOnDeposit(userWbtcVaultFunds.toString())

      const wbtcContract = new ethers.Contract(loans.WBTC_ADDRESS, wbtc.abi, signer)
      const wbtcAuthAmt = await wbtcContract.allowance(userAddress, loans.LOAN_ADDRESS)
      const wbtcBalance = await wbtcContract.balanceOf(userAddress)
      setWbtcBalance(wbtcBalance.toString())
      setWbtcAuthorized(wbtcAuthAmt.toString())

      console.log('WBTC balance : ', wbtcBalance.toString())
      console.log('WBTC auth amt : ', wbtcAuthAmt.toString())

    })()

  }, [])
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              Request for a Loan
            </CCardHeader>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormSelect aria-label="Default select example" id="assettype">
                    <option>Choose an asset to borrow</option>
                    <option value="WBTC">renBTC</option>
                    <option value="RBTC">WBTC</option>
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel>Borrower public key #1</CFormLabel>
                  <CFormInput type="text" id="pubkey1" aria-describedby="pubkey1help" />
                  <CFormText id="pubkey1help">This pub key is used for the Bitcoin funding address</CFormText>
                </div>
                <div className="mb-3">
                  <CFormLabel>Borrower public key #2</CFormLabel>
                  <CFormInput type="text" id="pubkey2" aria-describedby="pubkey2help" />
                  <CFormText id="pubkey2help">This pub key is used for the Bitcoin vault address</CFormText>
                </div>
                <div className="mb-3">
                  <CFormLabel>Borrower hashed secret</CFormLabel>
                  <CFormInput type="text" id="hashsecret" aria-describedby="hashSecretHelp" />
                  <CFormText id="hashSecretHelp">The sha256 hash of the &quot;secret&quot;.  The borrower reveals the actual secret in order to take control of the funds being borrowed</CFormText>
                </div>
                <div className="mb-3">
                  <CFormLabel>Loan term</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder="# of days" aria-label="# of days" aria-describedby="basic-addon2"/>
                    <CInputGroupText id="loanterm">Days</CInputGroupText>
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel>Loan amount</CFormLabel>
                  <CFormInput type="text" id="loanamt" aria-describedby="loanamount" />
                  <CFormText id="loanamount">The amount to borrow (must be collateralized on Bitcoin network)</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLoanRequest()}>
                  Submit
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default RequestLoan
