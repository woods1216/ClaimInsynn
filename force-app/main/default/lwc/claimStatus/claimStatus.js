import { LightningElement, wire, api } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

//import CLAIM_HEADER_OBJECT from '@salesforce/schema/ClaimHeader__c';
//import CLAIM_HEADER_ID from '@salesforce/schema/ClaimHeader__c.Id';
import CLAIM_STATUS_ID from "@salesforce/schema/ClaimHeader__c.ClaimStatusId__c";
const CLAIM_HEAD_FIELDS = [CLAIM_STATUS_ID];

export default class ClaimStatus extends LightningElement {
  @api claimId;
  @api claimStatus;
  //claimId = "a004R00000hYWRlQAO";
  error;
  statusOptions = [];

  @wire(getPicklistValues, {
    recordTypeId: "012000000000000AAA",
    fieldApiName: CLAIM_STATUS_ID
  })
  picklistValues({ error, data }) {
    if (data) {
      this.error = undefined;
      this.statusOptions = data.values.map((type) => {
        return {
          label: type.label,
          value: type.value
        };
      });
      //console.log('data.map ' + JSON.stringify(this.steps));
    } else if (error) {
      this.statusOptions = [];
      this.error = error;
    }
  }

  get currentStatus() {
    return this.claimStatus;
  }
/*
  @wire(getRecord, { recordId: "$claimId", fields: CLAIM_HEAD_FIELDS })
  wiredClaimRecord({error, data}) {
      if (data) {
        this.currentStatus = data;
        error = undefined;
      } else if (error) {
        this.currentStatus = undefined;
        this.error = error;
      }
  }
*/
}
