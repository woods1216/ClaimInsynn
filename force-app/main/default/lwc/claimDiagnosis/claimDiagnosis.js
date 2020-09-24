import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getClaimDiagnosisList from '@salesforce/apex/ClaimViewController.getClaimDiagnosisList';
//import { refreshApex } from '@salesforce/apex';

//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Claim Status ID Reset!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Claim Status ID Reset Issue!';
const ERROR_VARIANT = 'error';


const columns = [
    { label: 'Diagnosis Name', fieldName: 'Name', type: 'text', editable: 'true' },
    { label: 'Diagnosis Name', fieldName: 'Diagnosis_Code__c', type: 'text', editable: 'true' },
    { label: 'Line Number', fieldName: 'LineNumber__c', type: 'number', editable: 'true' }
    ];

export default class ClaimDiagnosis extends NavigationMixin(LightningElement) {

    @api claimId;
    claimDiagnosis = [];
    error;
    isLoading = false;
    columns = columns;

    @wire(getClaimDiagnosisList, { ClaimId: '$claimId'})
    wiredClaimDiagnosisRecord(result) {
        this.isloading = true;
        this.claimDiagnosis = result;
        this.error = undefined;
        this.isloading = false;
        if (result.error) {
        this.error = result.error;
        this.claimDiagnosis = undefined;
        this.isloading = false;
        }
    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    //@api async refresh() { 
    //this.isLoading = true;
    //await refreshApex(this.claimDiagnosis);
    //this.isLoading = false;
    //}

    // By using the MessageContext @wire adapter, unsubscribe will be called
    // implicitly during the component descruction lifecycle.
    //@wire(MessageContext)
    //messageContext;

    // Encapsulate logic for LMS subscribe.
    //subscribeToMessageChannel() {
    //    this.subscription = subscribe(
    //        this.messageContext,
    //        CLAIM_SELECTED_CHANNEL,
    //        (message) => this.handleMessage(message)
    //    );
    //}

    // Handler for message received by component
    //handleMessage(message) {
    //    this.claimId = message.recordId;
    //}

    // Standard lifecycle hooks used to sub/unsub to message channel
    //connectedCallback() {
    //    if (this.subscription || this.claimId) {
    //        return;
    //    }
    //    this.subscribeToMessageChannel();
        //setTimeout(() => {
        //    this.isLoading = true;
        //}, 3000);
        //const evt = new ShowToastEvent({
        //title: SUCCESS_TITLE ,
        //message:  `returned Id: ${this.claimId}`,
        //variant: SUCCESS_VARIANT
        //});
        //this.dispatchEvent(evt);
        //console.log('result ' + JSON.stringify(result));
    //}
}