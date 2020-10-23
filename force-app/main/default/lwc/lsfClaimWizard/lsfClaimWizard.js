import { LightningElement, wire } from 'lwc';
import wizardTile from './wizardTile.html';
import headerTile from './headerTile.html';
import providerTile from './providerTile.html';
import diagnosisTile from './diagnosisTile.html';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Success!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error!";
const ERROR_VARIANT = "error";

import CLAIM_HEADER from "@salesforce/schema/ClaimHeader__c";
import CLAIM_PROVIDER from "@salesforce/schema/ClaimProvider__c";
import CLAIM_PROVIDER_NAME from '@salesforce/schema/ClaimProvider__c.Name';
import CLAIM_PROVIDER_NPI from '@salesforce/schema/ClaimProvider__c.ProviderNPI__c';
import CLAIM_PROVIDER_ROLE from '@salesforce/schema/ClaimProvider__c.Role__c';
import CLAIM_PROVIDER_CID from '@salesforce/schema/ClaimProvider__c.ClaimId__c';
import CLAIM_DIAGNOSIS from "@salesforce/schema/ClaimDiagnosis__c";

import getClaimDiagnosisList from "@salesforce/apex/ClaimViewController.getClaimDiagnosisList";
import { refreshApex } from "@salesforce/apex";
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

const columns = [
  { label: "Line Number", fieldName: "LineNumber__c", type: "text", editable: "true" },
  { label: "Diagnosis Code", fieldName: "Diagnosis_Code__c", type: "text", editable: "true" },
  { label: "Diagnosis Name", fieldName: "Name", type: "text", editable: "true" }
];

export default class LsfClaimWizard extends LightningElement {

  currentStep = 1;
  claimHeaderObject = CLAIM_HEADER;
  claimProviderObject = CLAIM_PROVIDER;
  claimDiagnosisObject = CLAIM_DIAGNOSIS;
  claimId = "a004R00000iUyX6QAK";
  claimProviderId = "a014R00000hPg82QAC";
  claimDiagnosisId = "a054R00003FeXGSQA3";
  //claimId;
  //claimProviderId;
  //claimDiagnosisId;
  claimDiagnosisColumns = columns;
  claimDiagnosis;
  draftValues = [];
  //draftDiagnosisValues = [];
  error;

  steps = [
    { label: 'wizardTile', value: 1 },
    { label: 'headerTile', value: 2 },
    { label: 'providerTile', value: 3 },
    { label: 'diagnosisTile', value: 4 },
    { label: 'linesTile', value: 5 },
  ];
  
  render() {
    switch(this.currentStep) {
      case 1:
        return wizardTile;
      case 2:
        return headerTile;
      case 3:
        return providerTile;
        case 3:
        return providerTile;
      case 4:
        return diagnosisTile;
      case 5:
        return linesTile;
      default:
        // code block
      
    }
  }
  
  nextHandler() {
    this.currentStep += 1;
  }

  prevHandler() {
    this.currentStep -= 1;
  }

  handleClaimHeaderSuccess(event) {
    this.claimId = event.detail.id;
    const evt = new ShowToastEvent({
      title: SUCCESS_TITLE,
      message: `claim Header Created ${this.claimId}`,
      variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(evt);
  }

  providerFields = [CLAIM_PROVIDER_CID, CLAIM_PROVIDER_NAME, CLAIM_PROVIDER_NPI, CLAIM_PROVIDER_ROLE];

  handleClaimProviderSuccess(event) {
    this.claimProviderId = event.detail.id;
    const evt = new ShowToastEvent({
      title: SUCCESS_TITLE,
      message: `claim Provider Created ${this.claimProviderId}`,
      variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(evt);

  }

  /*
  @wire(getClaimDiagnosisList, { ClaimId: "$claimId" })
  wiredClaimDiagnosisRecord({ error, data }) {
    if (data) {
      //this.isloading = true;
      this.claimDiagnosis = data;
      this.error = undefined;
      //this.isloading = false;
    } else if (error) {
      this.error = error;
      this.claimDiagnosis = undefined;
      //this.isloading = false;
    }
  }
  */
  
  getClaimDiagnosisRecords() {
    
    const evt = new ShowToastEvent({
      title: SUCCESS_TITLE,
      message: `getClaimDiagnosisRecords`,
      variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(evt);

    getClaimDiagnosisList({ ClaimId: this.claimId })
      .then((result) => {
        this.claimDiagnosis = result;
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error.body.message;
        this.claimDiagnosis = undefined;
      });
  }

  handleClaimDiagnosisSave(event) {
    const recordInputs =  event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });

    // Prepare the record IDs for getRecordNotifyChange()
    //const notifyChangeIds = fields.map(row => { return { "recordId": row.Id } });

    const promises = recordInputs.map(recordInput => updateRecord(recordInput));
    Promise.all(promises).then(claimdiagnosis => {
        this.dispatchEvent(
            new ShowToastEvent({
              title: SUCCESS_TITLE,
              message: `claim Diagnosis Updated`,
              variant: SUCCESS_VARIANT
            })
        );
        // Clear all draft values
        this.draftValues = [];

        // Display fresh data in the datatable
        return refreshApex(this.claimDiagnosis);
          
        // Refresh LDS cache and wires
        //getRecordNotifyChange(notifyChangeIds);

        // Display fresh data in the datatable
        //refreshApex(this.claimDiagnosis).then(() => {
          // Clear all draft values in the datatable
        //  this.claimDiagnosis = [];
        //});
    }).catch(error => {
        // Handle error
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.body.message,
          variant: ERROR_VARIANT
        })
    });
  }

  handleClaimDiagnosisSuccess(event) {
      this.claimDiagnosisId = event.detail.id;
      const evt = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: `claim Diagnosis Created ${this.claimDiagnosisId}`,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt);
      
      this.handleReset();
      this.getClaimDiagnosisRecords();
      // Display fresh data in the datatable
      return refreshApex(this.claimDiagnosis);
  }

  handleReset() { 
    const inputFields = this.template.querySelectorAll('lightning-input-field');

    for (let i = 1; i < inputFields.length; i++) {
      inputFields[i].reset();
    }
    
  }

}