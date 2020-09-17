import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import { subscribe, MessageContext } from 'lightning/messageService';
import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import CLAIM_HEADER_OBJECT from '@salesforce/schema/ClaimHeader__c';
import CLAIM_HEADER_NAME from '@salesforce/schema/ClaimHeader__c.Name';
import CLAIM_STATUS_ID from '@salesforce/schema/ClaimHeader__c.ClaimStatusId__c';
import CLAIM_SUBMIT_ON from '@salesforce/schema/ClaimHeader__c.SubmittedOn__c';
import MEMBER_PLAN_ID from '@salesforce/schema/ClaimHeader__c.MemberPlanId__c';
//import MEMBER_PLAN_ID from '@salesforce/schema/MemberPlanId__r.Name';
import CLAIM_AMT_ROLL from '@salesforce/schema/ClaimHeader__c.ClaimAmount__c';
import CLAIM_ADJUD_DT from '@salesforce/schema/ClaimHeader__c.AdjudicatedOn__c';
import CLAIM_ADJUD_AMT from '@salesforce/schema/ClaimHeader__c.AdjudicatedAmount__c';
const CLAIM_HEAD_FIELDS = [CLAIM_HEADER_NAME, CLAIM_STATUS_ID, CLAIM_SUBMIT_ON, MEMBER_PLAN_ID, CLAIM_AMT_ROLL, CLAIM_ADJUD_DT, CLAIM_ADJUD_AMT];

//import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//const SUCCESS_TITLE = 'Claim Found!';
//const SUCCESS_VARIANT = 'success';

export default class ClaimHeader extends NavigationMixin(LightningElement) {

    @api isUnlocked = false;
    claimHeaderId = "a004R00000hY98bQAC";
    claimHeaderObject = CLAIM_HEADER_OBJECT;
    error;
    claimId;

    handleClick() {
        this.isUnlocked = !this.isUnlocked;
    }



    @wire(getRecord, { recordId: '$claimId', fields: CLAIM_HEAD_FIELDS })
    wiredClaimRecord

    get claimHeadName() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_HEADER_NAME) : "error";
    }
    
    get claimStatusId() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_STATUS_ID) : "error";
    }

//    get claimDraftStatus() { 
//        if (claimStatusId === "Draft") {
//            return this.isUnlocked = true;
//        } else {
//            return this.isUnlocked = false;
//        }
//    }

    get claimSubmittedOn() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_SUBMIT_ON) : "error";
    }
    
    get memberPlanId() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, MEMBER_PLAN_ID) : "error";
    }
    
    get claimAmountRollup() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_AMT_ROLL) : "error";
    }
    
    get claimAdjudicatedDate() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_ADJUD_DT) : "error";
    }
    
    get claimAdjudicatedAmt() { 
        return this.wiredClaimRecord.data ? getFieldValue(this.wiredClaimRecord.data, CLAIM_ADJUD_AMT) : "error";
    }
    
    editClaimHeader() {
        this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            recordId: "a004R00000hY98bQAC",
            objectApiName: 'ClaimHeader__c',
            actionName: 'edit',
        },
        });
    }
        
    // By using the MessageContext @wire adapter, unsubscribe will be called
    // implicitly during the component descruction lifecycle.
    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            CLAIM_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    // Handler for message received by component
    handleMessage(message) {
        this.claimId = message.recordId;
    }

    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
        //const evt = new ShowToastEvent({
        //title: SUCCESS_TITLE ,
        //message:  `returned Id: ${this.claimId}`,
        //variant: SUCCESS_VARIANT
        //});
        //this.dispatchEvent(evt);
        //console.log('result ' + JSON.stringify(result));
    }

}