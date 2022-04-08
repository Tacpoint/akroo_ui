import React, { useRef, useState, useEffect } from 'react'

import {
  CImage,
  CButton,
  CButtonGroup,
  CCard,
  CForm,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CFormLabel,
  CFormInput,
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

const WBTCDeposit = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcOnDeposit, setWbtcOnDeposit] = useState()

  const handleLenderDeposit = async () => {

    const depositAmt = document.querySelector('#wbtcAmt');
    console.log('deposit amt : ', depositAmt.value)

    //console.log(util.inspect(depositAmt))

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
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>WBTC Deposits</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3">
                        <div className="text-medium-emphasis small">Utilization Rate</div>
                        <div className="fs-5 fw-semibold">53%</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Total Deposits</div>
                        <div className="fs-5 fw-semibold">8,802.78</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Current APY &nbsp;&nbsp;</div>
                        <div className="fs-5 fw-semibold">1.20%</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Available Liquidity</div>
                        <div className="fs-5 fw-semibold">4,165.96</div>
                      </div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <br />
              <div className="text-medium-emphasis small">Current WBTC on Deposit:  {wbtcOnDeposit}</div>
              <br />
              <CForm className="row g-3">
                <div className="avatar avatar-md">
                  <CImage src={wbtclogo} width={36} height={36} />
                </div>
                <div className="col-auto">
                  <CFormInput type="text" id="wbtcAmt" placeholder="WBTC to deposit" />
                </div>
                <div className="col-auto">
                  <CButton type="submit" className="mb-3" color="success" variant="outline" onClick={() => handleLenderDeposit()}>
                    Deposit
                  </CButton>
                </div>
              </CForm>

              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WBTCDeposit
