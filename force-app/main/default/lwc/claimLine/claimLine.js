import { LightningElement, wire, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";

import getClaimLineList from "@salesforce/apex/ClaimViewController.getClaimLineList";
import { refreshApex } from "@salesforce/apex";
import { updateRecord } from 'lightning/uiRecordApi';

//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Success";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";

const readonly_columns = [
  { label: "Name", fieldName: "Name", type: "text" },
  { label: "Procedure Name", fieldName: "ProcedureCPTHCPCSId__c", type: "text" },
  { label: "Line Status", fieldName: "ClaimStatusId__c", type: "text" },
  { label: "Location", fieldName: "Location__c", type: "text" }
];

const editable_columns = [
  { label: "Name", fieldName: "Name", type: "text", editable: "true" },
  { label: "Procedure Name", fieldName: "ProcedureCPTHCPCSId__c", type: "text", editable: "true" },
  { label: "Line Status", fieldName: "ClaimStatusId__c", type: "text", editable: "true" },
  { label: "Location", fieldName: "Location__c", type: "text", editable: "true" }
];

export default class ClaimLine extends NavigationMixin(LightningElement) {
  @api claimId;
  @api claimStatus;
  claimLines = [];
  error;
  isLoading = false;
  //columns = claimLineColumns;
  draftValues = [];
  headerCount = 0;

  @wire(getClaimLineList, { ClaimId: '$claimId'})
  wiredClaimLineRecord(results) {
          //console.log(`wire apex claim line: ${this.claimId}`);
          /*
          let prepClaimLines = [];
          results.data.forEach(asset => {
              let prepClaimLine = {};
              prepClaimLine.Id = asset.Id;
              prepClaimLine.Name = asset.Name;
              prepClaimLine.ProcedureCPTHCPCSId__c = asset.ProcedureCPTHCPCSId__r.Name;
              prepClaimLine.ClaimStatusId__c = asset.ClaimStatusId__c;
              prepClaimLine.Location__c = asset.Location__c;
              prepClaimLines.push(prepClaimLine);
          });
          this.claimLines = prepClaimLines;
          */
          this.claimLines = results;
          //this.headerCount = this.claimLines.length;
          this.error = undefined;
          this.isloading = false;
        if (results.error) {
          this.error = results.error;
          this.claimLines = undefined;
          this.headerCount = 0;
          this.isloading = false;
        }
  }

  navigateToRelatedList() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordRelationshipPage',
        attributes: {
            recordId: this.claimId,
            objectApiName: 'ClaimLine__c',
            relationshipApiName: 'ClaimIdonClaimLine__r',
            actionName: 'view'
        }
    });
  }

claimLineCount() {
  const countEvent = new CustomEvent('linecount', {
      detail: this.headerCount
  });
  
  this.dispatchEvent(countEvent);
  /*
  console.log('dispatchEvent ' + JSON.stringify(select));
  */
  
}

get editClaim() {
  return (this.claimStatus === "Draft") ? true : false;
}

renderedCallback() {
  if(this.claimLines.length > 0) {
    console.log(`claim line renderedCallback: ${this.claimId}`);
    this.claimLineCount();
  }
}

get claimLineColumns() { 
  return (this.claimStatus === "Draft") ? editable_columns : readonly_columns;
}

connectedCallback() {
  console.log(`claim line connectedCallback:`);
}

claimLineSave(event) {
  const recordInputs =  event.detail.draftValues.slice().map(draft => {
      const fields = Object.assign({}, draft);
      return { fields };
  });

  const promises = recordInputs.map(recordInput => updateRecord(recordInput));
  Promise.all(promises).then(claimLines => {
      this.dispatchEvent(
          new ShowToastEvent({
              title: SUCCESS_TITLE,
              message: 'Claim Line(s) updated',
              variant: SUCCESS_VARIANT
          })
      );
       // Clear all draft values
       this.draftValues = [];

       // Display fresh data in the datatable
       return refreshApex(this.claimLines);
  }).catch(error => {
      // Handle error
      this.dispatchEvent(
        new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.body.message,
            variant: ERROR_VARIANT
        })
      )
    });
  }

  /*

    // Imperative Apex call to get claim lines for a claim
  getClaimLines() {
    if (this.claimId == null || this.claimId == "") {
      return;
    }
    this.isLoading = true;
    this.error = undefined;
    getClaimLineList({ ClaimId:this.claimId })
      .then((result) => {
            let prepClaimLines = [];
            result.forEach(asset => {
              let prepClaimLine = {};
              prepClaimLine.Id = asset.Id;
              prepClaimLine.Name = asset.Name;
              prepClaimLine.ProcedureCPTHCPCSId__c = asset.ProcedureCPTHCPCSId__r.Name;
              prepClaimLine.ClaimStatusId__c = asset.ClaimStatusId__c;
              prepClaimLine.Location__c = asset.Location__c;
              prepClaimLines.push(prepClaimLine);
            });
            this.claimLines = prepClaimLines;
            this.isLoading = false;
        })
      .catch((error) => {
        this.error = error.body.message;
        this.claimLines = undefined;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  handleRowAction(event) {
    //console.log("event " + JSON.stringify(event.detail.selectedRows[0]));
    this.selectedClaimLine = event.detail.selectedRows[0];
    //console.log("event " + JSON.stringify(this.selectedClaimLine.Id));
    const evt = new ShowToastEvent({
      title: SUCCESS_TITLE,
      message: `claim line Id: ${this.selectedClaimLine.Id}`,
      variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(evt);
  }

  deleteClaimLine() {
    //this.record = row;
    deleteRecord(this.selectedClaimLine.Id)
      .then(() => {
        refreshApex(this.getReviews());
        const evt = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: `claim line Id: ${this.selectedClaimLine.Id} DELETED`,
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(evt);
      })
      .catch((error) => {});
  }

  editClaimLine() {
    //this.record = row;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.selectedClaimLine.Id,
        objectApiName: "ClaimLine__c",
        actionName: "edit"
      }
    });
    refreshApex(this.getClaimLines());
  }

  @api refresh() {
    refreshApex(this.getReviews());
  }

  connectedCallback() {
    this.getClaimLines();
  }
  */
}
