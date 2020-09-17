({   

	fireComponentEvent : function(component, event, helper) {
		// Get the component event by using the
        // name value from aura:registerEvent
        // 
        // //                        "message" : "A component event fired me. " +
        //            "It all happened so fast. Now, I'm here!" });
        var cmpEvent = component.getEvent("cmpEvent");
        cmpEvent.setParams({
            "message" : component.get("v.searchTerm")
        })        
       
		cmpEvent.fire();

	}
    
})