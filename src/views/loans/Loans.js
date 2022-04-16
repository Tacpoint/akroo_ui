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

  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [loanTiles, setLoanTiles ] = useState();

  const navigate = useNavigate();

  const navigateToLoanDetails = async function(loanId, owner) {

     console.log("navigateToLoanDetails loan ID : ", loanId, " owner : ", owner);
     
     //navigate('/loandetails', { loanId: loanId, owner: owner });

     navigate('/loandetails', {
       state: {
         loanId: loanId,
         owner: owner,
       }
     });

     //console.log(document.querySelectorAll("p > div"));

  }


  useEffect(() => {

    (async () => {

      let OWNER_BORROWER = 'BORROWER';
      let OWNER_LENDER = 'LENDER';
      let OWNER_BOTH = 'BOTH';

      let owner = '';

      let cards = [];

      let tokenTitle = '';
      let tokenImage = '';

      let rtitle = 'renBTC';
      let wtitle = 'WBTC';

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

      var borrowerLoanMap = {};
      var lenderLoanMap = {};
      var combinedLoans = [];

      const borrowerLoans = await loanContract.borrowerLoans(userAddress);
      const lenderLoans = await loanContract.lenderLoans(userAddress);

      for (var i = 0; i < borrowerLoans.length; i++) {
         borrowerLoanMap[borrowerLoans[i]] = userAddress;
      }

      for (var i = 0; i < lenderLoans.length; i++) {
         lenderLoanMap[lenderLoans[i]] = userAddress;
      }

      combinedLoans.push.apply(combinedLoans, borrowerLoans);
      combinedLoans.push.apply(combinedLoans, lenderLoans);
      

      for (var i = 0; i < combinedLoans.length; i++) {

         // fetch each loan and create tile for display ...
         const loanDetails =  await loanContract.getLoanDetails(combinedLoans[i]);

         console.log("loan Id : ", combinedLoans[i]);
         console.log("token Id : ", loanDetails.tokenID);
         console.log("amount : ", loanDetails.amount.toString());
         console.log("loan term : ", loanDetails.loanTerm.toString());
         console.log("borrower hash : ", loanDetails.borrowerHashedSecret);
         console.log("rate : ", loanDetails.rate.toString());
         console.log("status : ", statusMap[loanDetails.fundsLocation.toString()]);
         console.log("loan status expiry date : ", loanDetails.locationExpiryDate.toString());

         var dueDate = new Date(loanDetails.locationExpiryDate.toNumber());
         console.log("Due date :", dueDate);

         // want to create a new row for every 3 records ...

         if (loanDetails.tokenID === loans.WBTC_ADDRESS) {
            tokenTitle = wtitle;
            tokenImage = wbtclogo;
         }
         if (loanDetails.tokenID === loans.RBTC_ADDRESS) {
            tokenTitle = rtitle;
            tokenImage = rbtclogo;
         }

         let abreviatedLoanId = combinedLoans[i].slice(0, 6)
         abreviatedLoanId = abreviatedLoanId.concat('...')
         abreviatedLoanId = abreviatedLoanId.concat(combinedLoans[i].slice(combinedLoans[i].length - 4, combinedLoans[i].length))

         if (borrowerLoanMap[combinedLoans[i]] && lenderLoanMap[combinedLoans[i]]) {
            owner = OWNER_BOTH;
         }
         else if (borrowerLoanMap[combinedLoans[i]]) {
            owner = OWNER_BORROWER;
         }
         else {
            owner = OWNER_LENDER;
         }

         let currentLoanId = combinedLoans[i].slice();
       
         cards.push(

           <CCol xs key={i}>
               <CCard style={{ width: '18rem' }} className="mb-3">
                 <CCardBody>
                   <CCardTitle>
                     <CImage src={tokenImage} width={36} height={36} />
                     &nbsp;&nbsp;{tokenTitle}
                   </CCardTitle>                
                     <div className="cardtextwrapper">
                       <div className="keyvaluewrapper">
                         <div className="itemkey">Loan ID:</div>
                         <div className="itemvalue">{abreviatedLoanId}</div>
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
                   <CButton onClick={() => navigateToLoanDetails({currentLoanId}, {owner})} >Loan Details</CButton>
                 </CCardBody>
               </CCard>
           </CCol>
        );

        /*
        if ( (i%3 === 2)) {
           cards.push(
             </CRow>
           );
        }
        */
      }

      setLoanTiles(cards);

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
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2, gutter: 4 }} lg={{ cols: 3, gutter: 4 }}> 
      {loanTiles}
      </CRow>

    </>
  )

}

export default Loans
