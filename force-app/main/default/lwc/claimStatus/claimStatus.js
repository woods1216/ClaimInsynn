import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

//import { subscribe, MessageContext } from 'lightning/messageService';
//import CLAIM_SELECTED_CHANNEL from '@salesforce/messageChannel/Claim_Selected__c';

//import CLAIM_HEADER_OBJECT from '@salesforce/schema/ClaimHeader__c';
//import CLAIM_HEADER_ID from '@salesforce/schema/ClaimHeader__c.Id';
import CLAIM_STATUS_ID from '@salesforce/schema/ClaimHeader__c.ClaimStatusId__c';


export default class ClaimStatus extends LightningElement {
    claimId = "a004R00000hYWRlQAO";
    error;
    currentStatus;
    steps;
    //    { label: 'Contacted', value: 'step-1' },
    //    { label: 'Open', value: 'step-2' },
    //    { label: 'Unqualified', value: 'step-3' },
    //    { label: 'Nurturing', value: 'step-4' },
    //    { label: 'Closed', value: 'step-5' },
    //];

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: CLAIM_STATUS_ID
    })
    picklistValues({ error, data }) {
        if (data) {
        //console.log('data.map.label ' + JSON.stringify(result.data.label));
        //console.log('data.map.value ' + JSON.stringify(result.data.value));
        this.error = undefined;
        this.steps = data;
        console.log('data.map ' + JSON.stringify(this.steps.values));
        }  else if (error) {
        console.log('data.error ' + JSON.stringify(error));
        this.steps = [];
        this.error = error;
        }
    }
}