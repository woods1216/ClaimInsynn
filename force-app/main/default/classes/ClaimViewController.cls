public with sharing class ClaimViewController {
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
}
