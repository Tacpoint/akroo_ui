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
import { wbtc } from 'src/contracts/wbtc'

const WBTCDeposit = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcAvailableBalance, setWbtcAvailableBalance] = useState()
  const [wbtcOnDeposit, setWbtcOnDeposit] = useState()
  const [wbtcAuthorized, setWbtcAuthorized] = useState()
  const [wbtcBalance, setWbtcBalance] = useState()
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false)

  const wbtcToApproveLabel = 'WBTC to approve'
  const wbtcToDepositLabel = 'WBTC to deposit'
  const wbtcToWithdrawLabel = 'WBTC to withdraw'

  const refreshBalances = async () => {

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      const userWbtcVaultFunds = await loanContract.UserTotalVaultFunds(userAddress, loans.WBTC_ADDRESS)
      setWbtcOnDeposit(userWbtcVaultFunds.toString())

      const userWbtcVaultAvailableFunds = await loanContract.UserVaultAvailFunds(userAddress, loans.WBTC_ADDRESS)
      console.log('WBTCDeposit - WBTC available vault funds balance for account : ',userAddress,' - ', userWbtcVaultAvailableFunds.toString())
      setWbtcAvailableBalance(userWbtcVaultAvailableFunds.toString())

      const wbtcContract = new ethers.Contract(loans.WBTC_ADDRESS, wbtc.abi, signer)
      const wbtcAuthAmt = await wbtcContract.allowance(userAddress, loans.LOAN_ADDRESS)
      const wbtcBalance = await wbtcContract.balanceOf(userAddress)
      setWbtcBalance(wbtcBalance.toString())
      setWbtcAuthorized(wbtcAuthAmt.toString())
    }
    catch (err) {
      alert(err)
    }

  }

  const handleLenderWithdrawal = async () => {

    const withdrawalAmt = document.querySelector('#wbtcAmtToWithdrawal');
    console.log('withdrawal amt : ', withdrawalAmt.value)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      let bn = ethers.BigNumber.from(withdrawalAmt.value)
      const tx = await loanContract.withdraw(loans.WBTC_ADDRESS, bn, {from:userAddress})
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);

      await refreshBalances();

    }
    catch (err) {
      alert(err)
    }

  }

  const handleLenderDeposit = async () => {

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

      await refreshBalances();

    }
    catch (err) {
      alert(err)
    }

  }

  const handleLenderApproveTransfer = async () => {

    const authAmt = document.querySelector('#wbtcAuth');
    console.log('Auth amt : ', authAmt.value)

    //console.log(util.inspect(depositAmt))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      let bn = ethers.BigNumber.from(authAmt.value)
      const wbtcContract = new ethers.Contract(loans.WBTC_ADDRESS, wbtc.abi, signer)
      const tx = await wbtcContract.approve(loans.LOAN_ADDRESS, bn, {from:userAddress})
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);

      await refreshBalances();

    }
    catch (err) {
      alert(err)
    }

  }

  useEffect(() => {

    (async () => {

      console.log('WBTCDeposit useEffect being called')
      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("WBTCDeposit - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("WBTCDeposit - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         return;
      }

      await refreshBalances();

    })()

  }, [])
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="avatar avatar-md">
                <CImage src={wbtclogo} width={36} height={36} />
              </div>
              &nbsp;&nbsp;WBTC Deposits
            </CCardHeader>
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
              {isMetamaskConnected === true &&
              <div>
              <CRow>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">Current WBTC on deposit:</div>
                </CCol>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">{wbtcOnDeposit}</div>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">Current WBTC available balance (not in loan use):</div>
                </CCol>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">{wbtcAvailableBalance}</div>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">WBTC balance:</div>
                </CCol>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">{wbtcBalance}</div>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">WBTC approved for transfer:</div>
                </CCol>
                <CCol sm={6}>
                  <div className="text-medium-emphasis small">{wbtcAuthorized}</div>
                </CCol>
              </CRow>
              <br />
              <CForm className="row g-3">
                <div className="col-sm-6">
                  <CFormInput type="text" id="wbtcAuth" placeholder={wbtcToApproveLabel} />
                </div>
                <div className="col-auto">
                  <CButton type="submit" className="mb-3" variant="outline" onClick={() => handleLenderApproveTransfer()}>
                    Approve&nbsp;&nbsp;
                  </CButton>
                </div>
              </CForm>
              <CForm className="row g-3">
                <div className="col-sm-6">
                  <CFormInput type="text" id="wbtcAmt" placeholder={wbtcToDepositLabel} />
                </div>
                <div className="col-auto">
                  <CButton type="submit" className="mb-3" color="success" variant="outline" onClick={() => handleLenderDeposit()}>
                    Deposit&nbsp;&nbsp;&nbsp;
                  </CButton>
                </div>
              </CForm>
              <CForm className="row g-3">
                <div className="col-sm-6">
                  <CFormInput type="text" id="wbtcAmtToWithdrawal" placeholder={wbtcToWithdrawLabel} />
                </div>
                <div className="col-auto">
                  <CButton type="submit" className="mb-3" color="danger" variant="outline" onClick={() => handleLenderWithdrawal()}>
                    Withdraw
                  </CButton>
                </div>
              </CForm>
              </div>
              }

              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default WBTCDeposit
