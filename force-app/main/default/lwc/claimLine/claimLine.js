import { LightningElement, wire, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { deleteRecord } from "lightning/uiRecordApi";

import getClaimLineList from "@salesforce/apex/ClaimViewController.getClaimLineList";
import { refreshApex } from "@salesforce/apex";

//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Claim Status ID Reset!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Claim Status ID Reset Issue!";
const ERROR_VARIANT = "error";

const columns = [
  { label: "Name", fieldName: "Name", type: "text" },
  {
    label: "Procedure Name",
    fieldName: "ProcedureCPTHCPCSId__c",
    type: "text"
  },
  { label: "Line Status", fieldName: "ClaimStatusId__c", type: "text" },
  { label: "Location", fieldName: "Location__c", type: "text" }
];

export default class ClaimLine extends NavigationMixin(LightningElement) {
  @api claimId;
  @api claimStatus;
  claimLines = [];
  error;
  isLoading = false;
  columns = columns;
  //selectedClaimLine = {};
  headerCount = 0;

  @wire(getClaimLineList, { ClaimId: '$claimId'})
  wiredClaimLineRecord( {error, data} ) {
      if (data) {
          this.isloading = true;
          //console.log('apex result ' + JSON.stringify(result));
          //this.claimLines.Name = `<a data-record-id=${claimLine.Id} onclick=${navigateToRecord} title=${claimLine.Name}>${claimLine.Name}</a>`;
          let prepClaimLines = [];
          data.forEach(asset => {
              let prepClaimLine = {};
              prepClaimLine.Id = asset.Id;
              prepClaimLine.Name = asset.Name;
              prepClaimLine.ProcedureCPTHCPCSId__c = asset.ProcedureCPTHCPCSId__r.Name;
              prepClaimLine.ClaimStatusId__c = asset.ClaimStatusId__c;
              prepClaimLine.Location__c = asset.Location__c;
              prepClaimLines.push(prepClaimLine);
          });
          this.claimLines = prepClaimLines;
          this.headerCount = this.claimLines.length;
          this.claimLineCount();
          this.error = undefined;
          this.isloading = false;
      } else if (error) {
          this.error = error;
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
  const evt = new ShowToastEvent({
      title: SUCCESS_TITLE ,
      message:  `headerCount: ${this.headerCount}`,
      variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(evt); 
  */
  
}

get editClaim() {
  return (this.claimStatus === "Draft") ? true : false;
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
