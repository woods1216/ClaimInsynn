/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { LightningElement, track, api } from "lwc";
//import getAccounts from "@salesforce/apex/ClaimViewController.getAccounts";
//import deleteAccounts from "@salesforce/apex/ClaimViewController.deleteAccounts";
import getClaimLineList from "@salesforce/apex/ClaimViewController.getClaimLineList";
import deleteClaimLine from "@salesforce/apex/ClaimViewController.deleteClaimLine";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
export default class ClaimLine2 extends NavigationMixin(LightningElement) {
  @api claimId;
  @track myList = [];
  error;
  remove(event) {
    let indexPosition = event.currentTarget.name;
    const recId = event.currentTarget.dataset.id;
    deleteClaimLine({ toDeleteId: recId })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: `Record deleted succesfully!`,
            variant: "success"
          })
        );
        if (this.myList.length > 1) this.myList.splice(indexPosition, 1);
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
      });
  }
  connectedCallback() {
    this.getClaimLineRecords();
  }
  getClaimLineRecords() {
    getClaimLineList({ ClaimId: this.claimId })
      .then((result) => {
        this.myList = result;
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.record = undefined;
      });
  }
}
