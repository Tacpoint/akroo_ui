import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

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

const LoanDetails = () => {

  var util = require('util')

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

  const [needsBorrowerSignature, setNeedsBorrowerSignature] = useState(true);
  const [needsBorrowerHash, setNeedsBorrowerHash] = useState(true);
  const [needsLenderApproval, setNeedsLenderApproval] = useState(true);

  const [loanTile, setLoanTile ] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLoanRequest = async () => {
  }

  useEffect(() => {

    (async () => {

      
      //console.log("LoanDetails - loan Id passed in : ", location.state.loanId.currentLoanId); 
      //console.log("LoanDetails - owner passed in : ", location.state.owner.owner); 

      let loanId = location.state.loanId.currentLoanId;
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

     console.log("token Id : ", loanDetails.tokenID);
     console.log("amount : ", loanDetails.amount.toString());
     console.log("loan term : ", loanDetails.loanTerm.toString());
     console.log("borrower hash : ", loanDetails.borrowerHashedSecret);
     console.log("rate : ", loanDetails.rate.toString());
     console.log("status : ", statusMap[loanDetails.fundsLocation.toString()]);
     console.log("loan status expiry date : ", loanDetails.locationExpiryDate.toString());

     var dueDate = new Date(loanDetails.locationExpiryDate.toNumber());
     console.log("Due date :", dueDate);


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
                 <CCardBody>
                   <CCardTitle>
                     <CImage src={tokenImage} width={36} height={36} />
                     &nbsp;&nbsp;{tokenTitle}
                   </CCardTitle>                
                     <CTable hover>
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
                           <CTableDataCell>{loanDetails.loanTerm.toString()}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Due Date</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.locationExpiryDate.toString()}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Interest Rate</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.rate.toString()}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Secret</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerHashedSecret}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Secret</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderHashedSecret}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Funding Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderBtcPubKeys[0]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Lender Vault Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.lenderBtcPubKeys[1]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Funding Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerBtcPubKeys[0]}</CTableDataCell>
                         </CTableRow>
                         <CTableRow>
                           <CTableHeaderCell scope="row">Borrower Vault Pub Key</CTableHeaderCell>
                           <CTableDataCell>{loanDetails.borrowerBtcPubKeys[1]}</CTableDataCell>
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
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLoanRequest()}>
                  Add Borrower Funding Signature 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected &&
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
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLoanRequest()}>
                  Claim funds as borrower 
                </CButton>
              </CForm>
              <br />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      }
      {isMetamaskConnected &&
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Lender approval of funds for release to borrower</CFormLabel>
                  <CFormText id="lenderReleaseEscrowHelp">After the lender verifies the borrower funding tx signature, they use this action to approve funds to be claimed by the borrower if the borrower provides secret which hashes to the borrower secret hash used when applying for the loan</CFormText>
                </div>
                <CButton type="submit" color="success" variant="outline" onClick={() => handleLoanRequest()}>
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
