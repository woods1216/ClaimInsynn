import { LightningElement, wire, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import getClaimDiagnosisList from "@salesforce/apex/ClaimViewController.getClaimDiagnosisList";
import { refreshApex } from "@salesforce/apex";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Claim Diagnosus message!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Claim Diagnosus message Issue!";
const ERROR_VARIANT = "error";

const columns = [
  { label: "Line Number", fieldName: "LineNumber__c", type: "text" },
  { label: "Diagnosis Code", fieldName: "Diagnosis_Code__c", type: "text" },
  { label: "Diagnosis Name", fieldName: "Name", type: "text" }
];

export default class ClaimDiagnosis extends NavigationMixin(LightningElement) {
  @api claimId;
  @api claimStatus;
  claimDiagnosis = [];
  error;
  isLoading = false;
  columns = columns;
  headerCount = 0;

  @wire(getClaimDiagnosisList, { ClaimId: "$claimId" })
  wiredClaimDiagnosisRecord({ error, data }) {
    if (data) {
      console.log(`apex wire claim diagnosis: ${this.claimId}`);
      this.isloading = true;
      this.claimDiagnosis = data;
      this.headerCount = this.claimDiagnosis.length;
      //console.log('headerCount ' + JSON.stringify(this.headerCount));
      //this.claimDiagnosisCount();
      this.error = undefined;
      this.isloading = false;
    } else if (error) {
      this.error = error;
      this.claimDiagnosis = undefined;
      this.headerCount = 0;
      this.isloading = false;
    }
  }

  navigateToRelatedList() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordRelationshipPage",
      attributes: {
        recordId: this.claimId,
        objectApiName: "ClaimDiagnosis__c",
        relationshipApiName: "ClaimDiagnosisLineofClaimId__r",
        actionName: "view"
      }
    });
  }

  claimDiagnosisCount() {
    const countEvent = new CustomEvent("diagnosiscount", {
      detail: this.headerCount
    });

    this.dispatchEvent(countEvent);

  }

  get editClaim() {
    return this.claimStatus === "Draft" ? true : false;
  }

  // this public function must refresh the claim diagnosis asynchronously
  @api refresh() {
    this.isLoading = true;
    refreshApex(this.claimDiagnosis);
    this.isLoading = false;
  }

  renderedCallback() {
    if(this.claimDiagnosis.length > 0) {
      console.log(`claim diagnosis renderedCallback: ${this.claimId}`);
      this.claimDiagnosisCount();
    }
  }

  connectedCallback() {
    console.log(`claim diagnosis connectedCallback:`);
  }
}
