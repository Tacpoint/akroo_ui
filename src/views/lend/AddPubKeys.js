import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import {
  CAlert,
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

const AddPubKeys = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [wbtcTokenAddress, setWbtcTokenAddress] = useState()
  const [rbtcTokenAddress, setRbtcTokenAddress] = useState()
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertColor, setAlertColor] = useState('')

  const navigate = useNavigate();

  const handleAddPubKeysRequest = async () => {

    //navigate('/rbtcdeposit', { replace: true });

    const pubkey1 = document.querySelector('#pubkey1');
    const pubkey2 = document.querySelector('#pubkey2');
    const hashsecret = document.querySelector('#hashsecret');
    const hashsecrethex = '0x'+hashsecret.value;

    console.log('lender pubkey 1 : ', pubkey1.value)
    console.log('lender pubkey 2 : ', pubkey2.value)
    console.log('lender hash : ', hashsecrethex)

    //console.log(util.inspect(depositAmt))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      var pk1array = [];
      var pk2array = [];
      var hasharray = [];

      pk1array.push(pubkey1.value);
      pk2array.push(pubkey2.value);
      hasharray.push(hashsecrethex);

      const tx = await loanContract.addBatchLenderBtcPubKeyAndSecret(pk1array, pk2array, hasharray, {from:userAddress});

      console.log("tx object : "+JSON.stringify(tx));
      console.log(`Transaction hash: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Gas used: ${receipt.gasUsed.toString()}`);
      setAlertMsg("Public keys and hash were successfully added!");
      setAlertColor("success");
      setAlertVisible(true);
      window.scrollTo({top: 0, behavior: 'smooth'});

    }
    catch (err) {
      console.log(JSON.stringify(err))
      setAlertMsg("Unable to add public keys and hash - reason : "+err);
      setAlertColor("danger");
      setAlertVisible(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }

  }

  useEffect(() => {

    (async () => {
      console.log('AddPubKeys useEffect being called')
      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("AddPubKeys - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("AddPubKeys - is metamask connected ? "+mmConnected);

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
              Add Public Keys and Secrets
            </CCardHeader>
            {isMetamaskConnected &&
            <CCardBody>
              <CForm>
                <div className="mb-3">
                   <CAlert color={alertColor} dismissible visible={alertVisible} onClose={() => setAlertVisible(false)}>{alertMsg}</CAlert>
                </div>
                <div className="mb-3">
                  <CFormLabel>Lender Funding public key</CFormLabel>
                  <CFormInput type="text" id="pubkey1" aria-describedby="pubkey1help" />
                  <CFormText id="pubkey1help">This pub key is used for the Bitcoin funding address</CFormText>
                </div>
                <div className="mb-3">
                  <CFormLabel>Lender Vault public key</CFormLabel>
                  <CFormInput type="text" id="pubkey2" aria-describedby="pubkey2help" />
                  <CFormText id="pubkey2help">This pub key is used for the Bitcoin vault address</CFormText>
                </div>
                <div className="mb-3">
                  <CFormLabel>Lender Vault hashed secret</CFormLabel>
                  <CFormInput type="text" id="hashsecret" aria-describedby="hashSecretHelp" />
                  <CFormText id="hashSecretHelp">The sha256 hash of the &quot;secret&quot;.  The lender reveals the actual secret once the borrower repays the loan allowing the lender to take possesion of the loan payment and the borrower to spend from the Bitcoin Vault transaction</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleAddPubKeysRequest()}>
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

export default AddPubKeys
