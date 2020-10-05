import { LightningElement, wire, api } from 'lwc';

import getClaimLineList from '@salesforce/apex/ClaimViewController.getClaimLineList';
//import { getListUi } from 'lightning/uiListApi';
//import CONTACT_OBJECT from '@salesforce/schema/Contact';
import { NavigationMixin } from 'lightning/navigation';

export default class ClaimLine1 extends NavigationMixin(LightningElement) {
    @api claimId;
    claimLines = [];
    error;
    isLoading = false;

    @wire(getClaimLineList, { ClaimId: '$claimId'})
    wiredClaimLineRecord( {error, data} ) {
        if (data) {
            this.isloading = true;
            console.log('apex result ' + JSON.stringify(data));
            //this.claimLines.Name = `<a data-record-id=${claimLine.Id} onclick=${navigateToRecord} title=${claimLine.Name}>${claimLine.Name}</a>`;
            let prepClaimLines = [];
            let tempData = [];
            tempData = data;
            tempData.forEach(asset => {
                let prepClaimLine = {};
                prepClaimLine.Id = asset.Id;
                prepClaimLine.Name = asset.Name;
                prepClaimLine.ProcedureCPTHCPCSId__c = asset.ProcedureCPTHCPCSId__r.Name;
                prepClaimLine.ClaimStatusId__c = asset.ClaimStatusId__c;
                prepClaimLine.Location__c = asset.Location__c;
                prepClaimLine.Price__c = asset.Price__c;
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


    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {
        //event.preventDefault();       // stop the form from submitting
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.recordId,
                objectApiName: 'ClaimLine__c',
                actionName: 'edit'
            }
        });
    }    

}