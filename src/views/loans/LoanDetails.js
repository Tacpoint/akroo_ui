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
  const [loanTile, setLoanTile ] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    (async () => {

      
      //console.log("LoanDetails - loan Id passed in : ", location.state.loanId.currentLoanId); 
      //console.log("LoanDetails - isBorrower flag passed in : ", location.state.isBorrower.isBorrower); 

      let loanId = location.state.loanId.currentLoanId;
      let isBorrower = location.state.isBorrower.isBorrower;

      console.log("LoanDetails - loan Id passed in : ", loanId); 
      console.log("LoanDetails - isBorrower flag passed in : ", isBorrower); 
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
                     <div className="cardtextwrapper">
                       <div className="keyvaluewrapper">
                         <div className="itemkey">Loan ID:</div>
                         <div className="itemvalue-loan-details">{loanId}</div>
                       </div> 
                       <div className="keyvaluewrapper">
                         <div className="itemkey">Loan Status:</div>
                         <div className="itemvalue">{statusMap[loanDetails.fundsLocation.toString()]}</div>
                       </div>                       
                       <div className="keyvaluewrapper">
                           <div className="itemkey">Loan Amt:</div>
                           <div className="itemvalue">{loanDetails.amount.toString()}</div>
                       </div>
                       <div className="keyvaluewrapper">
                           <div className="itemkey">Term:</div>
                           <div className="itemvalue">{loanDetails.loanTerm.toString()}</div>
                       </div>   
                       <div className="keyvaluewrapper">
                           <div className="itemkey">Due Date:</div>
                           <div className="itemvalue">{loanDetails.locationExpiryDate.toString()}</div>
                       </div>      
                       <div className="keyvaluewrapper">
                           <div className="itemkey">Interest Rate:</div>
                           <div className="itemvalue">{loanDetails.rate.toString()}</div>
                       </div>                                                              
                     </div>
                   <br/>
                   <CButton href="#">Do Something</CButton>
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
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              Loan Details
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
      {loanTile}
      </CRow>

    </>
  )

}

export default LoanDetails
