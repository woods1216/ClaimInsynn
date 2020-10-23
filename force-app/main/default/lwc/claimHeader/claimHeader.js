import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue, updateRecord, generateRecordInputForUpdate } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

//import { publish, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import CLAIM_HEADER_OBJECT from '@salesforce/schema/ClaimHeader__c';
import CLAIM_HEADER_ID from '@salesforce/schema/ClaimHeader__c.Id';
import CLAIM_HEADER_NAME from '@salesforce/schema/ClaimHeader__c.Name';
import CLAIM_STATUS_ID from '@salesforce/schema/ClaimHeader__c.ClaimStatusId__c';
import CLAIM_SUBMIT_ON from '@salesforce/schema/ClaimHeader__c.SubmittedOn__c';
import MEMBER_PLAN_ID from '@salesforce/schema/ClaimHeader__c.MemberPlanId__r.Name';
import CLAIM_AMT_ROLL from '@salesforce/schema/ClaimHeader__c.ClaimAmount__c';
import CLAIM_ADJUD_DT from '@salesforce/schema/ClaimHeader__c.AdjudicatedOn__c';
import CLAIM_ADJUD_AMT from '@salesforce/schema/ClaimHeader__c.AdjudicatedAmount__c';
const CLAIM_HEAD_FIELDS = [CLAIM_HEADER_NAME, CLAIM_STATUS_ID, CLAIM_SUBMIT_ON, MEMBER_PLAN_ID, CLAIM_AMT_ROLL, CLAIM_ADJUD_DT, CLAIM_ADJUD_AMT];

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Claim Status ID Reset!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Claim Status ID Reset Issue!';
const ERROR_VARIANT = 'error';

const IS_UNLOCKED = false;
const IS_LOCKED = true;

export default class ClaimHeader extends NavigationMixin(LightningElement) {


    claimHeaderObject = CLAIM_HEADER_OBJECT;
    error;
    @api claimId;
    //claimStatus;
    claimHeader;

    @wire(getRecord, { recordId: '$claimId', fields: CLAIM_HEAD_FIELDS }) 
    wiredClaimRecord( { error, data} ) {
        if (data) {
            this.claimHeader = data;
            //publishClaimStatus(this.claimId, this.claimStatusId);
            this.error = undefined;    
        } else if (error) {
            this.claimHeader = undefined;
            this.error = error;
        }
    }

    handleStatusReset() {

        if (!this.claimId) return;
        if (this.claimHeader && this.claimLockStatus) {

            // Create the recordInput object
            const fields = {};
            fields[CLAIM_HEADER_ID.fieldApiName] = this.claimId;
            fields[CLAIM_STATUS_ID.fieldApiName] = "Draft";
            
            const recordInput = { fields };

            updateRecord(recordInput)
            .then(data => {
                //publishClaimStatus(this.claimId, "Draft");
                const toastEvent = new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: "Claim Status Reset to Draft",
                    variant: SUCCESS_VARIANT
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
              const toastEvent = new ShowToastEvent({
                title: ERROR_TITLE,
                message: `error details: see console.log`,
                variant: ERROR_VARIANT
              });
              this.dispatchEvent(toastEvent);
              console.log('error ' + JSON.stringify(error));
            });
        }
    }

    get claimHeadName() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_HEADER_NAME) : "error";
    }
    
    get claimStatusId() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_STATUS_ID) : "error";
    }

    get claimLockStatus() { 
        return (this.claimStatusId === "Draft") ? IS_UNLOCKED : IS_LOCKED;
    }

    get claimSubmittedOn() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_SUBMIT_ON) : "error";
    }
    
    get memberPlanId() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, MEMBER_PLAN_ID) : "error";
    }
    
    get claimAmountRollup() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_AMT_ROLL) : "error";
    }
    
    get claimAdjudicatedDate() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_ADJUD_DT) : "error";
    }
    
    get claimAdjudicatedAmt() { 
        return this.claimHeader ? getFieldValue(this.claimHeader, CLAIM_ADJUD_AMT) : "error";
    }
    
    editClaimHeader() {
        this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            recordId: this.claimId,
            objectApiName: 'ClaimHeader__c',
            actionName: 'edit'
        },
        });
    }

    /*
    // By using the MessageContext @wire adapter, unsubscribe will be called
    // implicitly during the component descruction lifecycle.
    @wire(MessageContext)
    messageContext;

    publishClaimStatus(id, status) {
        const payload = { recordId: id, recordStatus: status };
        publish(this.messageContext, CLAIM_SELECTED_CHANNEL, payload);
    }
    */

    // Standard lifecycle hooks used to sub/unsub to message channel
    //connectedCallback() {
    //    this.subscribeToMessageChannel();
        //const evt = new ShowToastEvent({
        //title: SUCCESS_TITLE ,
        //message:  `returned Id: ${this.claimId}`,
        //variant: SUCCESS_VARIANT
        //});
        //this.dispatchEvent(evt);
        //console.log('result ' + JSON.stringify(result));
    //}

}