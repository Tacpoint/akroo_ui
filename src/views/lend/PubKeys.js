import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import {
  CImage,
  CButton,
  CFormSelect,
  CButtonGroup,
  CCard,
  CForm,
  CContainer,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardImage,
  CCardTitle,
  CCardSubtitle,
  CCardText,
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
import rbtclogo from 'src/assets/images/ren-bitcoin.png'

import cardbg1 from 'src/assets/images/card_bg1.png'
import cardbg2 from 'src/assets/images/card_bg2.png'
import cardbg3 from 'src/assets/images/card_bg3.png'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

import { ethers } from 'ethers'
import { loans } from 'src/contracts/loans'
import { wbtc } from 'src/contracts/wbtc'

const PubKeys = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcOnDeposit, setWbtcOnDeposit] = useState()
  const [wbtcAuthorized, setWbtcAuthorized] = useState()
  const [wbtcBalance, setWbtcBalance] = useState()
  const navigate = useNavigate();

  const logFormatErrors = async () => {

     console.log(document.querySelectorAll("p > div"));

  }

  const renderKeys = () => {
    let keys = [];

    let pk1 = '3d0bafe1371bc3ebec2d43f104d5eb4bacff76799b3581ba18556000108492ed';
    let pk2 = '3d0bafe1371bc3ebec2d43f104d5eb4bacff76799b3581ba18556000108492ed';
    let secret = '0x93c94bae9cbde81229579d80c68e54e77b1271837ddaf2ffe0fd29d0916eb41b';
    let loanId = 'some loan id ...';

    for (let i = 0; i <= 10; i++) {
     
      keys.push(

      <CTableRow v-for="item in tableItems" key={i} color="light">
        <CTableDataCell>
          <div>Public Key #1 </div>
          <div>Public Key #2 </div>
          <div>Hashed Secret </div>
          <div className="small text-medium-emphasis">
            <span>Loan ID </span> 
          </div>
        </CTableDataCell>
        <CTableDataCell>
          <div>{pk1}</div>
          <div>{pk2}</div>
          <div>{secret}</div>
          <div><a href="#">{loanId}</a></div>
        </CTableDataCell>
      </CTableRow>

      )
    }

    return keys
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
              My Public Keys and Secrets
              <CButton href="#"  onClick={() => logFormatErrors()} className="loanFilterSelect"  size="sm">Add Keys / Secret</CButton>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableBody>
        {renderKeys()}
        </CTableBody>
     </CTable>

    </>
  )

}

export default PubKeys
