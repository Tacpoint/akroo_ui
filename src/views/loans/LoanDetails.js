import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import {
  CAlert,
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

const LoanDetails = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  const [needsBorrowerSignature, setNeedsBorrowerSignature] = useState(false);
  const [needsBorrowerHash, setNeedsBorrowerHash] = useState(false);
  const [needsLenderApproval, setNeedsLenderApproval] = useState(false);
  const [needsBorrowerPayback, setNeedsBorrowerPayback] = useState(false);
  const [needsLenderHash, setNeedsLenderHash] = useState(false);

  const [currentLoanId, setCurrentLoanId] = useState('');
  const [loanPayoff, setLoanPayoff] = useState('');
  const [borrowerPreImage, setBorrowerPreImage] = useState('');
  const [lenderPreImage, setLenderPreImage] = useState('');

  const [loanTile, setLoanTile ] = useState();

  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [alertColor, setAlertColor] = useState('')

  const navigate = useNavigate();
  const location = useLocation();

  const handleLoanRequest = async () => {
  }

  const handleBorrowerPayback = async () => {

      console.log('LoanDetails handleBorrowerPayback being called')

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      try {
         const tx = await loanContract.fundRepaymentEscrow(currentLoanId, {from:userAddress});
         console.log("tx object : "+JSON.stringify(tx));
         console.log(`Transaction hash: ${tx.hash}`);
         const receipt = await tx.wait();
         console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
         console.log(`Gas used: ${receipt.gasUsed.toString()}`);

         setAlertMsg("Borrower loan repayment was successful");
         setAlertColor("success");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'}); 
      }
      catch (err) {
         console.log("Error : ", err);
         console.log("Error msg : ", err.data.message);
         setAlertMsg("Unable to process loan repayment - reason : "+err.data.message);
         setAlertColor("danger");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
  }

  const handleBorrowerClaimFunds = async () => {

      console.log('LoanDetails handleBorrowerClaimFunds being called')
      const borrowerSecret = document.querySelector('#borrowerSecret');
      console.log("Borrower secret : ", borrowerSecret.value);

      let borrowerSecretHex = '0x'+borrowerSecret.value;

      console.log("Current loan Id : ", currentLoanId);

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      try {
         const tx = await loanContract.claimLoanEscrowFunds(currentLoanId, borrowerSecretHex, {from:userAddress});
         console.log("tx object : "+JSON.stringify(tx));
         console.log(`Transaction hash: ${tx.hash}`);
         const receipt = await tx.wait();
         console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
         console.log(`Gas used: ${receipt.gasUsed.toString()}`);

         setAlertMsg("Loan escrow funds were released to the borrower");
         setAlertColor("success");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
      catch (err) {
         console.log("Error : ", err);
         console.log("Error msg : ", err);
         setAlertMsg("Unable to release funds to borrower - reason : "+err);
         setAlertColor("danger");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
  }

  const handleLenderClaimFunds = async () => {

      console.log('LoanDetails handleLenderClaimFunds being called')
      const lenderSecret = document.querySelector('#lenderSecret');
      console.log("Lender secret : ", lenderSecret.value);

      let lenderSecretHex = '0x'+lenderSecret.value;

      console.log("Current loan Id : ", currentLoanId);

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      try {
         const tx = await loanContract.claimRepayEscrowFunds(currentLoanId, lenderSecretHex, {from:userAddress});
         console.log("tx object : "+JSON.stringify(tx));
         console.log(`Transaction hash: ${tx.hash}`);
         const receipt = await tx.wait();
         console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
         console.log(`Gas used: ${receipt.gasUsed.toString()}`);

         setAlertMsg("Loan escrow funds were released to the lender");
         setAlertColor("success");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
      catch (err) {
         console.log("Error : ", err);
         console.log("Error msg : ", err.data.message);
         setAlertMsg("Unable to release funds to lender - reason : "+err.data.message);
         setAlertColor("danger");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
  }

  const handleLenderApproveFundsRelease = async () => {

      console.log('LoanDetails handleLenderApproveFundsRelease being called')

      console.log("Current loan Id : ", currentLoanId);

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      try {
         const tx = await loanContract.fundLoanEscrow(currentLoanId, {from:userAddress});
         console.log("tx object : "+JSON.stringify(tx));
         console.log(`Transaction hash: ${tx.hash}`);
         const receipt = await tx.wait();
         console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
         console.log(`Gas used: ${receipt.gasUsed.toString()}`);

         setAlertMsg("Loan has been funded by the lender and awaiting claim from the borrower");
         setAlertColor("success");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
      catch (err) {
         console.log("Error : ", err);
         console.log("Error msg : ", err.data.message);
         setAlertMsg("Unable to approve funds release to borrower - reason : "+err.data.message);
         setAlertColor("danger");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }
  }

  const handleAddBorrowerSig = async () => {

      console.log('LoanDetails handleAddBorrowerSig being called')
      const borrowerSig = document.querySelector('#borrowerSig');

      console.log("Borrower signature : ", borrowerSig.value);
      console.log("Current loan Id : ", currentLoanId);

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      try {
         const tx = await loanContract.addBorrowerSignedBtcTx(currentLoanId, borrowerSig.value, {from:userAddress});
         console.log("tx object : "+JSON.stringify(tx));
         console.log(`Transaction hash: ${tx.hash}`);
         const receipt = await tx.wait();
         console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
         console.log(`Gas used: ${receipt.gasUsed.toString()}`);

         setAlertMsg("Borrower signature was successfully added!");
         setAlertColor("success");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'}); 
      }
      catch (err) {
         console.log("Error : ", err);
         console.log("Error msg : ", err.data.message);
         setAlertMsg("Unable to add borrower signature - reason : "+err.data.message);
         setAlertColor("danger");
         setAlertVisible(true);
         window.scrollTo({top: 0, behavior: 'smooth'});
      }


  }

  useEffect(() => {

    (async () => {

      
      //console.log("LoanDetails - loan Id passed in : ", location.state.loanId.currentLoanId); 
      //console.log("LoanDetails - owner passed in : ", location.state.owner.owner); 

      let loanId = location.state.loanId.currentLoanId;
      setCurrentLoanId(loanId);

      let owner = location.state.owner.owner;

      console.log("LoanDetails - loan Id passed in : ", loanId); 
      console.log("LoanDetails - owner value passed in : ", owner); 
      let cards = [];

      let tokenTitle = '';
      let tokenImage = '';

      let rtitle = 'renBTC';
      let wtitle = 'WBTC';

      console.log('LoanDetails useEffect being called')

      if (!window.ethereum) {
        alert('Please connect wallet!')
        return;
      }

      let res = await window.ethereum.request({ method: 'eth_accounts' });
      let mmConnected = false;

      if (!res[0]) {
        console.log("LoanDetails - no accounts found for metamask!");
        setIsMetamaskConnected(false);
      }
      else {
        console.log("LoanDetails Accounts found - setting metamask connect to true");
        setIsMetamaskConnected(true);
        mmConnected = true;
      }

      console.log("LoanDetails - is metamask connected ? "+mmConnected);

      if (!mmConnected) {
         alert("Please connect your wallet!");
         return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      let userAddress = await signer.getAddress()
      const loanContract = new ethers.Contract(loans.LOAN_ADDRESS, loans.abi, signer)

      var statusMap = {};
      statusMap["1"] = "Lender";
      statusMap["2"] = "Lender Reserved";
      statusMap["3"] = "Borrower Signed";
      statusMap["4"] = "Escrow to Borrower";
      statusMap["5"] = "Borrower Funded";
      statusMap["6"] = "Escrow to Lender";
      statusMap["7"] = "Abandoned";

     const loanDetails =  await loanContract.getLoanDetails(loanId);
     console.log("Loan Details : ", JSON.stringify(loanDetails));

     console.log("token Id : ", loanDetails.tokenID);
     console.log("amount : ", loanDetails.amount.toString());
     console.log("loan term : ", loanDetails.loanTerm.toString());
     console.log("borrower hash : ", loanDetails.borrowerHashedSecret);
     console.log("rate : ", loanDetails.rate.toString());
     console.log("status : ", statusMap[loanDetails.fundsLocation.toString()], " ", loanDetails.fundsLocation.toString());
     console.log("loan status expiry date : ", loanDetails.locationExpiryDate.toString());

     let expiryDateInMillis = loanDetails.locationExpiryDate.mul(1000);
     let dueDate = new Date(expiryDateInMillis.toNumber());
     let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     let formattedDueDate = dueDate.toLocaleDateString("en-US", dateOptions);
     console.log("Due date :", formattedDueDate);

     // convert loan term to days (stored in seconds) for display to the user
     let termOfLoan = loanDetails.loanTerm.div(86400);
     console.log("Term of loan in days : ", termOfLoan.toString());
    

     if (loanDetails.fundsLocation.toString() === "1") {
        setNeedsBorrowerSignature(true);
     }
     if (loanDetails.fundsLocation.toString() === "2") {
        setNeedsLenderApproval(true);
     }
     if (loanDetails.fundsLocation.toString() === "3") {
        setNeedsBorrowerHash(true);
     }
     if (loanDetails.fundsLocation.toString() === "4") {

        try {
           // find loan payoff amount for display

           const paymentDemand = await loanContract.getPaymentDemand(loanId,loanDetails.locationExpiryDate.toNumber());
           console.log("Payment demand : "+JSON.stringify(paymentDemand));
           setLoanPayoff(paymentDemand.toNumber());
           console.log("Loan payment demand : ", paymentDemand.toNumber());
           setNeedsBorrowerPayback(true);
        }
        catch (err) {
           console.log("Error : ", JSON.stringify(err));
           console.log("Error msg : ", err.error.data.message);
           alert("Error msg : "+err.error.data.message);
        }
     }
     if (loanDetails.fundsLocation.toString() === "5") {
        setNeedsLenderHash(true);
     }
        
     if (loanDetails.tokenID === loans.WBTC_ADDRESS) {
        tokenTitle = wtitle;
        tokenImage = wbtclogo;
     }
     if (loanDetails.tokenID === loans.RBTC_ADDRESS) {
        tokenTitle = rtitle;
        tokenImage = rbtclogo;
     }
     
     let i = 0;
       
         cards.push(
           <CCol key={i}>
               <CCard>
                 <CCardHeader>
                   <div className="avatar avatar-md">
                     <CImage src={tokenImage} width={36} height={36} />
                   </div>
                   &nbsp;&nbsp;{tokenTitle}
                 </CCardHeader>
                 <CCardBody>
                     <CTable hover responsive>
                       <CTableBody>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Loan ID</CTableHeaderCell>
                           <CTableDataCell>{loanId}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Loan Status</CTableHeaderCell>
                           <CTableDataCell>{statusMap[loanDetails.fundsLocation.toString()]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Loan Amt</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.amount.toString()}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Term</CTableHeaderCell>
                           <CTableDataCell>{termOfLoan.toString()} days</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Due Date</CTableHeaderCell>
                           <CTableDataCell>{formattedDueDate}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Interest Rate</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.rate.toString()}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Hashed Secret</CTableHeaderCell>
                           <CTableDataCell scope="row">{loanDetails.borrowerHashedSecret.slice(2, loanDetails.borrowerHashedSecret.length)}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Secret</CTableHeaderCell>
                           <CTableDataCell scope="row">{loanDetails.borrowerSecret.slice(2, loanDetails.borrowerSecret.length)}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Funding Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerBtcPubKeys[0]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Vault Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerBtcPubKeys[1]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Signature</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerSignature}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Hashed Secret</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderHashedSecret.slice(2, loanDetails.lenderHashedSecret.length)}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Secret</CTableHeaderCell>
                           <CTableDataCell scope="row">{loanDetails.lenderSecret.slice(2, loanDetails.lenderSecret.length)}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Funding Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderBtcPubKeys[0]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Vault Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderBtcPubKeys[1]}</CTableDataCell>
                         </CTableRow>
                       </CTableBody>
                     </CTable>
                 </CCardBody>
               </CCard>
           </CCol>
        );

      setLoanTile(cards);

   })()

  }, [])
  return (
    <>
      <CRow>
        <div className="mb-3">
          <CAlert color={alertColor} dismissible visible={alertVisible} onClose={() => setAlertVisible(false)}>{alertMsg}</CAlert>
        </div>
      </CRow>
      <CRow>
      {loanTile}
      </CRow>
      <br/>
      {isMetamaskConnected && needsBorrowerSignature &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Borrower Funding Tx Signature</CFormLabel>
                  <CFormInput type="text" id="borrowerSig" aria-describedby="sighelp" />
                  <CFormText id="sighelp">Signature from the borrower needed by the lender to spend from the funding tx to the vault tx</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleAddBorrowerSig()}>
                  Add Borrower Funding Signature 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected && needsBorrowerPayback &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Borrower Loan Payback</CFormLabel>
                  <CFormText id="borrowerLoanPaybackHelp">Payoff the current loan balance : {loanPayoff}</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleBorrowerPayback()}>
                  Payback loan as borrower 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected && needsBorrowerHash &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Borrower Secret</CFormLabel>
                  <CFormInput type="text" id="borrowerSecret" aria-describedby="borrowerSecretHelp" />
                  <CFormText id="sighelp">Borrower secret that hashes to the borrower hashed secret.  Providing a valid secret allows the borrower to claim the funds in escrow</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleBorrowerClaimFunds()}>
                  Claim funds as borrower 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected && needsLenderHash &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Lender Secret</CFormLabel>
                  <CFormInput type="text" id="lenderSecret" aria-describedby="lenderSecretHelp" />
                  <CFormText id="sighelp">Lender secret that hashes to the lender hashed secret.  Providing a valid secret allows the lender to claim the funds in escrow and the borrower to spend from the Bitcoin transaction used as collateral for the loan</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLenderClaimFunds()}>
                  Claim funds as lender 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected && needsLenderApproval &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Lender approval of funds for release to borrower</CFormLabel>
                  <CFormText id="lenderReleaseEscrowHelp">After the lender verifies the borrower funding tx signature, they use this action to approve funds to be claimed by the borrower if the borrower provides secret which hashes to the borrower secret hash used when applying for the loan</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLenderApproveFundsRelease()}>
                  Lender Approval
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }

    </>
  )

}

export default LoanDetails
