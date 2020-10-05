public with sharing class ClaimViewController {
    @AuraEnabled
    public static ClaimHeader__c getClaimHeaderId (String claimName) {
        return [
        SELECT Id, ClaimStatusId__c
        FROM ClaimHeader__c
        WHERE Name = :claimName
        WITH SECURITY_ENFORCED
        LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<ClaimLine__c> getClaimLineList(String ClaimId) {
        return [
            SELECT Id, Name, ProcedureCPTHCPCSId__r.Name, ClaimStatusId__c, Location__c, Price__c 
            FROM ClaimLine__c
            WHERE ClaimId__c = :ClaimId
            WITH SECURITY_ENFORCED
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<ClaimDiagnosis__c> getClaimDiagnosisList(String ClaimId) {
        return [
            SELECT Id, Name, LineNumber__c, Diagnosis_Code__c 
            FROM ClaimDiagnosis__c
            WHERE ClaimId__c = :ClaimId
            WITH SECURITY_ENFORCED
        ];
    }

    @AuraEnabled
    public static String deleteClaimLine(String toDeleteId){
        List<ClaimLine__c> claimLine = new List<ClaimLine__c>();
        ClaimLine__c c = new ClaimLine__c();
        c.Id = toDeleteId;
        claimLine.add(c);
        Database.DeleteResult[] drList = Database.delete(claimLine, false);
		List<String> deletedIds = new List<String>();
        List<String> errorMessages = new List<String>();
        // Iterate through each returned result
        for(Database.DeleteResult dr : drList) {
            if (dr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully deleted account with ID: ' + dr.getId());
                deletedIds.add(dr.getId());
                
            }
            else {
                // Operation failed, so get all errors                
                for(Database.Error err : dr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                    errorMessages.add(err.getMessage());
                }
                
            }
        }
        if(deletedIds.size() > 0)
            return 'success';
        else
            return errorMessages[0];
    }

    @AuraEnabled
    public static List<Account> getAccounts(){
    //return [SELECT Id, Name, Industry, accountrich__c, Master_Picklist__c, Controlling_Picklist__c, Dependent_Picklist__c, JobType__c, JobType__r.Name, Customer__c 
        return [SELECT Id, Name, Industry
        from ACCOUNT 
        Where createdDate != NULL ORDER BY createdDate DESC LIMIT 10];
    }

    @AuraEnabled
    public static String deleteAccounts(String toDeleteId){
        List<account> acc = new List<Account>();
        Account a = new Account();
        a.Id = toDeleteId;
        acc.add(a);
        Database.DeleteResult[] drList = Database.delete(acc, false);
		List<String> deletedIds = new List<String>();
        List<String> errorMessages = new List<String>();
        // Iterate through each returned result
        for(Database.DeleteResult dr : drList) {
            if (dr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully deleted account with ID: ' + dr.getId());
                deletedIds.add(dr.getId());
                
            }
            else {
                // Operation failed, so get all errors                
                for(Database.Error err : dr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                    errorMessages.add(err.getMessage());
                }
                
            }
        }
        if(deletedIds.size() > 0)
            return 'success';
        else
            return errorMessages[0];
    }
}
