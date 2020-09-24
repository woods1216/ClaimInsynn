import { LightningElement, wire, api } from 'lwc';

//import getClaimLineList from '@salesforce/apex/ClaimViewController.getClaimLineList';
import { getListUi } from 'lightning/uiListApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class ClaimLine1 extends LightningElement {
    claimId;
    claimLines = [];
    error;
    pageToken = null;
    nextPageToken = null;
    previousPageToken = null;
    //isLoading = false;

    @wire(getListUi, {
        objectApiName: CONTACT_OBJECT,
        listViewApiName: 'All_Recipes_Contacts'
    })listView({ error, data }) {
        if (data) {
            console.log('wire result ' + JSON.stringify(data));
            this.claimLines = data;
            this.error = undefined;
            //this.nextPageToken = data.records.nextPageToken;
            //this.previousPageToken = data.records.previousPageToken;
        } else if (error) {
            this.error = error;
            this.claimLines = undefined;
        }
    }

    handleNextPage(e) {
        this.pageToken = this.nextPageToken;
    }

    handlePreviousPage(e) {
        this.pageToken = this.previousPageToken;
    }

}