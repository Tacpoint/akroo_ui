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

const Loans = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcOnDeposit, setWbtcOnDeposit] = useState()
  const [wbtcAuthorized, setWbtcAuthorized] = useState()
  const [wbtcBalance, setWbtcBalance] = useState()
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  const navigate = useNavigate();

  const logFormatErrors = async () => {

     console.log(document.querySelectorAll("p > div"));

  }

  const renderCards = () => {
    let cards = [];

    let rtitle = 'renBTC';
    let wtitle = 'WBTC';
    let bgImage;
    let status = 'Funds Claimed';
    let token;
    let tokenLogo;
    let loanAmt = '0.85';
    let loanId = '0xAD456...';
    let collateral;
    let term = '30 days';
    let dueDate = 'May 8, 2022';
    let interestRate = '1.88 %'

    if (!isMetamaskConnected) return cards;

    for (let i = 0; i <= 10; i++) {
     
      cards.push(
        <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2, gutter: 4 }} lg={{ cols: 3, gutter: 4 }} key={i}>
          <CCol xs>
              <CCard style={{ width: '18rem' }} className="mb-3">
                <CCardImage orientation="top" src={cardbg1} />
                <CCardBody>
                  <CCardTitle>
                    <CImage src={wbtclogo} width={36} height={36} />
                    &nbsp;&nbsp;{wtitle}
                  </CCardTitle>                
                    <div className="cardtextwrapper">
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan ID:</div>
                        <div className="itemvalue">{loanId}</div>
                      </div> 
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan Status:</div>
                        <div className="itemvalue">{status}</div>
                      </div>                       
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Loan Amt:</div>
                          <div className="itemvalue">{loanAmt}</div>
                      </div>
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Term:</div>
                          <div className="itemvalue">{term}</div>
                      </div>   
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Due Date:</div>
                          <div className="itemvalue">{dueDate}</div>
                      </div>      
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Interest Rate:</div>
                          <div className="itemvalue">{interestRate}</div>
                      </div>                                                              
                    </div>
                    <br/>

                  <CButton href="#"  onClick={() => logFormatErrors()} >Loan Details</CButton>
                </CCardBody>
              </CCard>
          </CCol>
          <CCol xs>
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src={cardbg3} />
                <CCardBody>
                  <CCardTitle>
                    <CImage src={rbtclogo} width={36} height={36} />
                    &nbsp;&nbsp;{rtitle}
                  </CCardTitle>
                    <div className="cardtextwrapper">
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan ID:</div>
                        <div className="itemvalue">{loanId}</div>
                      </div> 
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan Status:</div>
                        <div className="itemvalue">{status}</div>
                      </div>                        
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Loan Amt:</div>
                          <div className="itemvalue">{loanAmt}</div>
                      </div>
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Term:</div>
                          <div className="itemvalue">{term}</div>
                      </div>   
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Due Date:</div>
                          <div className="itemvalue">{dueDate}</div>
                      </div>      
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Interest Rate:</div>
                          <div className="itemvalue">{interestRate}</div>
                      </div>                                                              
                    </div>
                    <br/>

                  <CButton href="#"  onClick={() => logFormatErrors()} >Loan Details</CButton>
                </CCardBody>
              </CCard>
          </CCol>
          <CCol xs>
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src={cardbg2} />
                <CCardBody>
                  <CCardTitle>
                    <CImage src={rbtclogo} width={36} height={36} />
                    &nbsp;&nbsp;{rtitle}
                  </CCardTitle>
                    <div className="cardtextwrapper">
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan ID:</div>
                        <div className="itemvalue">{loanId}</div>
                      </div> 
                      <div className="keyvaluewrapper">
                        <div className="itemkey">Loan Status:</div>
                        <div className="itemvalue">{status}</div>
                      </div>                        
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Loan Amt:</div>
                          <div className="itemvalue">{loanAmt}</div>
                      </div>
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Term:</div>
                          <div className="itemvalue">{term}</div>
                      </div>   
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Due Date:</div>
                          <div className="itemvalue">{dueDate}</div>
                      </div>      
                      <div className="keyvaluewrapper">
                          <div className="itemkey">Interest Rate:</div>
                          <div className="itemvalue">{interestRate}</div>
                      </div>                                                              
                    </div>
                    <br/>

                  <CButton href="#"  onClick={() => logFormatErrors()} >Loan Details</CButton>
                </CCardBody>
              </CCard>
          </CCol>
        </CRow>
      )
    }

    return cards
  }

  useEffect(() => {

    (async () => {

      console.log('Loans useEffect being called')
      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("Loans - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("Loans - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         return;
      }

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
              My Loans
              {isMetamaskConnected  &&
              <CFormSelect aria-label="Loan status filter" size="sm" id="loanstatusfilter" className="loanFilterSelect">
                <option value="active">Show Active Loans</option>
                <option value="all">Show All Loans</option>
              </CFormSelect>
              }
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      {renderCards()}

    </>
  )

}

export default Loans
