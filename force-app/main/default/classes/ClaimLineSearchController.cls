public class ClaimLineSearchController{
    @AuraEnabled
    public static List <ClaimLine__c> fetchClaimLines(String searchTerm) {
        //Qyery 10 accounts
        //System.debug('Hello World!');
        System.debug('The Search which has satisfied the condition '+searchTerm);
        //String modifiedSearchTerm = '%'+searchTerm+'%';
        //System.debug('The Modified Search which has satisfied the condition '+modifiedSearchTerm);
        List<ClaimLine__c> clainLine = [SELECT Name, ClaimId__c, 
                                        ClaimStatusId__c, From__c , To__c, 
                                        ProcedureCPTHCPCSId__c , 
                                        Unit__c , 
                                        Price__c 
                                        FROM ClaimLine__c
                                        WHERE ClaimId__c IN (SELECT  Id
                                                             FROM ClaimHeader__c
                                                             WHERE Name=:searchTerm)];
        //return list of accounts
        return clainLine;
    }
}