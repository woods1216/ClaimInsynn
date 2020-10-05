import { LightningElement, api } from "lwc";
import getClaimLineList from "@salesforce/apex/ClaimViewController.getClaimLineList";
//import deleteClaimLine from "@salesforce/apex/ClaimViewController.deleteClaimLine";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { deleteRecord } from "lightning/uiRecordApi";

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Claim Status ID Reset!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Claim Status ID Reset Issue!";
const ERROR_VARIANT = "error";

const actions = [
  { label: "Edit", name: "editClaimLine", iconName: "utility:edit" },
  { label: "Delete", name: "deleteClaimLine", iconName: "utility:delete" }
];

const columns = [
  { label: "Name", fieldName: "Name", type: "text" },
  { label: "Procedure Name", fieldName: "ProcedureCPTHCPCSId__c", type: "text" },
  { label: "Line Status", fieldName: "ClaimStatusId__c", type: "text" },
  { label: "Location", fieldName: "Location__c", type: "text" },
  {
    type: "action",
    typeAttributes: { rowActions: actions, menuAlignment: "right" }
  }
];

export default class ClaimLine3 extends NavigationMixin(LightningElement) {
  //claimId = "a004R00000hYWRlQAO";
  @api claimId;
  claimLines = [];
  columns = columns;
  isLoading = false;
  error;

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    switch (action.name) {
      case "editClaimLine":
        this.editClaimLine(row);
        refresh();
        break;
      case "deleteClaimLine":
        this.deleteClaimLine(row);
        const rows = this.claimLines;
        const rowIndex = rows.indexOf(row);
        rows.splice(rowIndex, 1);
        this.claimLines = rows;
        break;
    }
  }

  deleteClaimLine(row) {
    deleteRecord(row.Id)
      .then(() => {
        this.error = undefined;
        refresh();
      })
      .catch((error) => {
        this.error = error;
      });
  }

  editClaimLine(row) {
    //this.record = row;
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: row.Id,
        objectApiName: "ClaimLine__c",
        actionName: "edit"
      }
    });
  }

  // Imperative Apex call to get claim lines for a claim
  getClaimLines() {
    if (this.claimId == null || this.claimId == "") {
      return;
    }
    this.isLoading = true;
    this.error = undefined;
    getClaimLineList({ ClaimId: '$this.claimId' })
      .then((result) => {
        let prepClaimLines = [];
        result.forEach((asset) => {
          let prepClaimLine = {};
          prepClaimLine.Id = asset.Id;
          prepClaimLine.Name = asset.Name;
          prepClaimLine.ProcedureCPTHCPCSId__c =
            asset.ProcedureCPTHCPCSId__r.Name;
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

  connectedCallback() {
    const evt = new ShowToastEvent({
    title: SUCCESS_TITLE ,
    message:  `claim line 3 claim Id: ${this.claimId}`,
    variant: SUCCESS_VARIANT
    });
    this.dispatchEvent(evt);
    this.getClaimLines();
  }

  @api
  refresh() {
    refreshApex(this.getClaimLines());
  }
  handleRowDblClick(event) {

  }
}
