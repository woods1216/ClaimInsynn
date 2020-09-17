({
    fetchAcc : function(component, event, helper) {
        
        component.set('v.mycolumns', [
            {label: 'Claim Name', fieldName: 'Name', type: 'text', editable: true, typeAttributes: { required: true }},
                {label: 'Claim Status', fieldName: 'ClaimStatusId__c', type: 'text'},
                {label: 'From', fieldName: 'From__c', type: 'date' , editable: true,
                typeAttributes: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }},
                {label: 'To', fieldName: 'To__c', type: 'date', editable: true,
                typeAttributes: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }},
                {label: 'POC', fieldName: 'ProcedureCPTHCPCSId__c', type: 'text'},
                {label: 'Units', fieldName: 'Unit__c', type: 'number', editable: true},
                {label: 'Charges', fieldName: 'Price__c', type: 'currency', editable: true, 
                 typeAttributes: { 
                     currencyCode: 'USD', 
                     maximumSignificantDigits: 5
                 }}
            ]);
        
        //added 6/8 for Event based message
        var message = event.getParam("message");
        // set the handler attributes based on event data
        component.set("v.messageFromEvent", message);
        var numEventsHandled = parseInt(component.get("v.numEvents")) + 1;
        component.set("v.numEvents", numEventsHandled);	
        //added 6/8
        
        var action = component.get("c.fetchClaimLines");
        action.setParams({ searchTerm : component.get("v.messageFromEvent") });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.clainLine", response.getReturnValue());
                            
            }
        });
        $A.enqueueAction(action);
    },
    handleSaveEdition: function (cmp, event, helper) {
        var draftValues = event.getParam('draftValues');

        helper.saveEdition(cmp, draftValues);
    },
    handleCancelEdition: function (cmp) {
        // do nothing for now...
    }
})