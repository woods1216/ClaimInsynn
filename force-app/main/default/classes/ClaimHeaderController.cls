public with sharing class ClaimHeaderController {
    @AuraEnabled
    public static ClaimHeader__c getClaimHeaderId (String claimName) {
        return [
        SELECT Id
        FROM ClaimHeader__c
        WHERE Name = :claimName
        WITH SECURITY_ENFORCED
        LIMIT 1
        ];
        }
        
}
