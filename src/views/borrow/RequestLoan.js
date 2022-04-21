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

  const [wbtcTokenAddress, setWbtcTokenAddress] = useState()
  const [rbtcTokenAddress, setRbtcTokenAddress] = useState()
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false)

  const navigate = useNavigate();

  const handleLoanRequest = async () => {

    //navigate('/rbtcdeposit', { replace: true });

    const assetType = document.querySelector('#assettype');
    const pubkey1 = document.querySelector('#pubkey1');
    const pubkey2 = document.querySelector('#pubkey2');
    const hashsecret = document.querySelector('#hashsecret');
    const loanterm = document.querySelector('#loanterm');
    const loanamt = document.querySelector('#loanamt');

    const hashsecrethex = '0x'+hashsecret.value;

    console.log('borrow asset type : ', assetType.value)
    console.log('borrow pubkey 1 : ', pubkey1.value)
    console.log('borrow pubkey 2 : ', pubkey2.value)
    console.log('borrow hash : ', hashsecrethex)
    console.log('borrow term : ', loanterm.value)
    console.log('borrow amt : ', loanamt.value)

    //console.log(util.inspect(depositAmt))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)


      const loanApplicationFee = await loanContract.loanApplicationFee(loanamt.value); //in satoshi
      console.log("Loan application fee : ", loanApplicationFee)

      // loanterm is captured in days, but we need to convert to seconds ...
      let loanTermSeconds = loanterm.value * 86400;

      const tx = await loanContract.requestLoan(assetType.value, 
                                                loanamt.value, 
                                                loanTermSeconds, 
                                                hashsecrethex,
                                                pubkey1.value,
                                                pubkey2.value,
                                                {from:userAddress, value: loanApplicationFee});

      console.log("tx object : "+JSON.stringify(tx));
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);


      /*
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
      */

    }
    catch (err) {
      console.log(JSON.stringify(err))
      alert(JSON.stringify(err))
    }

  }

  useEffect(() => {

    (async () => {
      console.log('RequestLoan useEffect being called')
      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("RequestLoan - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("RequestLoan - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         return;
      }

      setWbtcTokenAddress(loans.WBTC_ADDRESS)
      setRbtcTokenAddress(loans.RBTC_ADDRESS)
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
            {isMetamaskConnected &&
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormSelect aria-label="Default select example" id="assettype">
                    <option>Choose an asset to borrow</option>
                    <option value={rbtcTokenAddress}>renBTC</option>
                    <option value={wbtcTokenAddress}>WBTC</option>
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
                    <CFormInput id="loanterm" placeholder="# of days" aria-label="# of days" aria-describedby="basic-addon2"/>
                    <CInputGroupText>Days</CInputGroupText>
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel>Loan amount</CFormLabel>
                  <CFormInput type="text" id="loanamt" aria-describedby="loanamount"  placeholder="# of sats you want to borrow" />
                  <CFormText id="loanamount">The amount to borrow in satoshis (must be collateralized on Bitcoin network)</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLoanRequest()}>
                  Submit
                </CButton>
              </CForm>
              <br />
            </CCardBody>
            }
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default RequestLoan
