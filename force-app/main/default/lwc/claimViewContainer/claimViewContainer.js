import { LightningElement, wire } from 'lwc';
//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';


export default class ClaimViewContainer extends LightningElement {
    
    claimId = "a004R00000hYWRlQAO";

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