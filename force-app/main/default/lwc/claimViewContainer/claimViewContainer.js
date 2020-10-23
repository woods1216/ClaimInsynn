import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
const SUCCESS_TITLE = "Claim View Controller!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Claim View Controller Issue!";
const ERROR_VARIANT = "error";

export default class ClaimViewContainer extends LightningElement {
    
    //claimId = "a004R00000hYWRlQAO";
    claimId;
    claimStatus;
    countDiagnosis = 0;
    countLines = 0;
    
    handleDiagnosisCount(event) {
        this.countDiagnosis = event.detail;
    }

    handleLinesCount(event) {
        this.countLines = event.detail;
        /*
        const evt = new ShowToastEvent({
        title: SUCCESS_TITLE ,
        message:  `event countLines: ${event.detail}`,
        variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(evt);
        */
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
        this.claimStatus = message.recordStatus;
        //console.log('this.claimId ' + JSON.stringify(this.claimId));
        //console.log('this.claimStatus ' + JSON.stringify(this.claimStatus));

    }

    renderedCallback() {
    
        console.log(`parent renderedCallback: ${this.claimId}`);
        this.template.querySelector('lightning-tabset').activeTabValue = "diagnosistab";
    }
    // Standard lifecycle hooks used to sub/unsub to message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    
        console.log(`parent connectedCallback:`);
    }

    get lwcTabDiagnosisLabel() {
        return `Claim Diagnosis (${this.countDiagnosis})`;
    }

    get lwcTabLineLabel() {
        return `Claim Lines (${this.countLines})`;
    }
}