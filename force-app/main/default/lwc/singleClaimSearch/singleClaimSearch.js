import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

import getClaimHeaderId from '@salesforce/apex/ClaimViewController.getClaimHeaderId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Claim Found!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Claim Not Found!';
const ERROR_VARIANT = 'error';

export default class SingleClaimSearch extends LightningElement {
    
    claimNum;
    claimId = '';
    error;

    handleSearchChange(event) {
        this.claimNum = event.target.value;
    }

    @wire(MessageContext)
    messageContext;

    handleSearch() {
        getClaimHeaderId({ claimName: this.claimNum })
            .then(result => {
                this.claimId = result.Id;
                this.error = undefined;
                const payload = { recordId: result.Id };
                publish(this.messageContext, CLAIM_SELECTED_CHANNEL, payload);
            })
            .catch(error => {
                //const evt = new ShowToastEvent({
                //    title: ERROR_TITLE ,
                //    message: error,
                //    variant: ERROR_VARIANT
                //    });
                //this.dispatchEvent(evt);
                this.error = error;
                this.claimId = undefined;
                const payload = { recordId: '' };
                publish(this.messageContext, CLAIM_SELECTED_CHANNEL, payload);

            });
 
    }

}