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
    claimStatus = '';
    error;

    handleSearchChange(event) {
        this.claimNum = event.target.value;
    }

    @wire(MessageContext)
    messageContext;

    handleSearch() {
        getClaimHeaderId({ claimName: this.claimNum })
            .then(result => {
                this.error = undefined;
                this.claimId = result.Id;
                this.claimStatus = result.ClaimStatusId__c;
                const payload = { recordId: result.Id, recordStatus: result.ClaimStatusId__c };
                publish(this.messageContext, CLAIM_SELECTED_CHANNEL, payload);
            })
            .catch(error => {
                this.error = error;
                this.claimId = undefined;
                this.claimStatus = undefined;
                const payload = { recordId: '', recordStatus: '' };
                publish(this.messageContext, CLAIM_SELECTED_CHANNEL, payload);

            });
 
    }

}