import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getClaimDiagnosisList from '@salesforce/apex/ClaimViewController.getClaimDiagnosisList';
//import { refreshApex } from '@salesforce/apex';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Claim Diagnosus message!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Claim Diagnosus message Issue!';
const ERROR_VARIANT = 'error';


const columns = [
    { label: 'Line Number', fieldName: 'LineNumber__c', type: 'text' },
    { label: 'Diagnosis Code', fieldName: 'Diagnosis_Code__c', type: 'text' },
    { label: 'Diagnosis Name', fieldName: 'Name', type: 'text' }
    ];

export default class ClaimDiagnosis extends NavigationMixin(LightningElement) {

    @api claimId;
    claimDiagnosis = [];
    error;
    isLoading = false;
    columns = columns;
    headerCount = 0;

    @wire(getClaimDiagnosisList, { ClaimId: '$claimId'})
    wiredClaimDiagnosisRecord( {error, data} ) {
        if (data) {
            this.isloading = true;
            this.claimDiagnosis = data;
            this.headerCount = this.claimDiagnosis.length;
            //console.log('headerCount ' + JSON.stringify(this.headerCount));
            this.claimDiagnosisCount();
            this.error = undefined;
            this.isloading = false;
        } else if (error) {
                this.error = error;
                this.claimDiagnosis = undefined;
                this.headerCount = 0;
                this.isloading = false;
        }
    }

    navigateToRelatedList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.claimId,
                objectApiName: 'ClaimDiagnosis__c',
                relationshipApiName: 'ClaimDiagnosisLineofClaimId__r',
                actionName: 'view'
            }
        });
    }

    claimDiagnosisCount() {
        const countEvent = new CustomEvent('diagnosiscount', {
            detail: this.headerCount
        });
        
        this.dispatchEvent(countEvent);
        /*
        console.log('dispatchEvent ' + JSON.stringify(select));
        const evt = new ShowToastEvent({
            title: SUCCESS_TITLE ,
            message:  `headerCount: ${this.headerCount}`,
            variant: SUCCESS_VARIANT
            });
            this.dispatchEvent(evt); 
        */
    }

    /*
    connectedCallback() {
        if (this.claimDiagnosis) {
            this.claimDiagnosisCount();
            const evt1 = new ShowToastEvent({
                title: SUCCESS_TITLE ,
                message:  "connectedCallback",
                variant: SUCCESS_VARIANT
                });
                this.dispatchEvent(evt1);  
        }
        
    }

    renderedCallback() {  
        const evt = new ShowToastEvent({
        title: SUCCESS_TITLE ,
        message:  `headerCount: ${this.headerCount}`,
        variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(evt);   
    }
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    @api async refresh() { 
    this.isLoading = true;
    await refreshApex(this.claimDiagnosis);
    this.isLoading = false;
    }
    */

}