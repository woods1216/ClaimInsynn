import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getClaimLineList from '@salesforce/apex/ClaimViewController.getClaimLineList';

//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Claim Status ID Reset!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Claim Status ID Reset Issue!';
const ERROR_VARIANT = 'error';


const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true' },
    { label: 'Procedure Name', fieldName: 'ProcedureCPTHCPCSId__c', type: 'text', editable: 'true' },
    { label: 'Line Status', fieldName: 'ClaimStatusId__c', type: 'text', editable: 'true' },
    { label: 'Location', fieldName: 'Location__c', type: 'text', editable: 'true' }
    ];

export default class ClaimLine extends NavigationMixin(LightningElement) {

    @api claimId;
    claimLines = [];
    error;
    isLoading = false;
    columns = columns;

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
            this.error = undefined;
            this.isloading = false;    
        } else if (error) {
            this.error = error;
            this.claimLines = undefined;
            this.isloading = false;
        }
    }

    navigateToRecord() {
        const evt = new ShowToastEvent({
        title: SUCCESS_TITLE ,
        message:  `record Id: ${this.claimLines.Id}`,
        variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(evt);    
    }

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