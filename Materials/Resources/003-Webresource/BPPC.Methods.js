if(typeof(BPPC) == 'undefined'){
	BPPC = {__namespace: true}
}

BPPC.Methods = (function(){
	
	bal_OnSendEmailsToAttendeesCustomApi = function(selectedItemsJoined) {		  
		this.bal_SelectedAttendees = selectedItemsJoined;    

	bal_OnSendEmailsToAttendeesCustomApi.prototype.getMetadata = function () {
		return {
				operationName: "bal_OnSendEmailsToAttendeesCustomApi",
				boundParameter: null,
				parameterTypes: {          
					bal_SelectedAttendees: {
						typeName: "Edm.String",
						structuralProperty: 1,
					}
				},
				operationType: 0 // This is an action
			};
		};
	}
	
	bal_UpdateRequest = function (entityTypeName, id, payload) {
		this.etn = entityTypeName;
		this.id = id;
		this.payload = payload;
		this.getMetadata = function () {
			return {
				boundParameter: null,
				parameterTypes: {},
				operationType: 2,
				operationName: "Update",
			};
		};
	};
	
	var runCustomApi = async function(selectedItems) {
		
		console.log('runCustomApi');
		
		Xrm.Utility.showProgressIndicator("Calling Business Event. Please wait...");
		
		console.log(selectedItems);
			
		var request = new bal_OnSendEmailsToAttendeesCustomApi(selectedItems.join(';'));       
		
        Xrm.WebApi.online.execute(request).then(
            function (result) {
				console.log(result);
						
				Xrm.Utility.closeProgressIndicator();
				Xrm.Navigation.openAlertDialog({
					title: "Success",
					text: "Business Event run successfully!",
				});		                
            },
            function (error) {
				Xrm.Utility.closeProgressIndicator();
                Xrm.Navigation.openErrorDialog({ details: error.message, message: 'An error occurred while calling the Business Event.'});
            }
        );      
	}
		
		
	function idWithoutBrackets(id) {
		if (id.slice(0, 1) === "{") {
			return id.slice(1, -1);
		} else {
			return id;
		}
	}
	
	function convertToSize(input, defaultSize) {
		let result = defaultSize;
		if (typeof input === "number") {
			if (input > 0) {
				result = input;
			}
		}
		else {
			const parsedInput = Number(input);
			if (isNaN(parsedInput)) {
				if (input.endsWith("px")) {
					const numberPart = Number(input.substring(0, input.length - 2));
					if (!isNaN(numberPart)) {
						result = { value: numberPart, unit: "px" };
					}
				}
				else if (input.endsWith("%")) {
					const numberPart = Number(input.substring(0, input.length - 1));
					if (!isNaN(numberPart)) {
						result = { value: numberPart, unit: "%" };
					}
				}
			}
			else {
				if (parsedInput > 0) {
					result = parsedInput;
				}
			}
		}
		
		return result;
	}
	
	var openCustomPage = async function(pageName, title, entityName = "", id = "", width = 600, height = 400, target = 2, position = 1) {
		
		console.log('openCustomPage');
		
		console.log(entityName);
		console.log(id);
		
		const defaultWidth = 600;
		const defaultHight = 400;
		const recId = idWithoutBrackets(id);
		
		console.log(recId);
		
		const pageInput = {
			pageType: "custom",
			name: pageName,
			entityName: entityName,
			recordId: recId,
		};
		
		const navigationOptions = {
			target: target,
			width: convertToSize(width, defaultWidth),
			height: convertToSize(height, defaultHight),
			position: position,
			title: title,
		};
		
		Xrm.Navigation.navigateTo(pageInput, navigationOptions)
		.then(function () {
			// Called when page opens
			return true;
		})
		.catch(function (error) {
			// Handle error
			console.log(error.message);
		});
	};		
	
	var openCustomPageV2 = async function(pageName, title, entityName = "", selectedIds = [], width = 600, height = 400, target = 2, position = 1) {
		
		console.log('openCustomPageV2');
		
		console.log(entityName);
		console.log(selectedIds);
		
		const defaultWidth = 600;
		const defaultHight = 400;
		const recId = selectedIds.join(";");
		
		console.log(recId);
		
		const pageInput = {
			pageType: "custom",
			name: pageName,
			entityName: entityName,
			recordId: recId,
		};
		
		const navigationOptions = {
			target: target,
			width: convertToSize(width, defaultWidth),
			height: convertToSize(height, defaultHight),
			position: position,
			title: title,
		};
		
		Xrm.Navigation.navigateTo(pageInput, navigationOptions)
		.then(function () {
			// Called when page opens
			return true;
		})
		.catch(function (error) {
			// Handle error
			console.log(error.message);
		});
	};		
	
	var modifyTriggerFlow = async function(selectedControl, selectedIds = []) {
			
		console.log('modifyTriggerFlow');
		console.log(selectedIds);
		
		Xrm.Utility.showProgressIndicator("Updating Trigger Flow column for selected records. Please wait...");
		
		var requests = [];
		
		for(let i=0; i<selectedIds.length; i++){
			let requestTmp = new bal_UpdateRequest(
				"bal_atendee",
				selectedIds[i],
				{
					"bal_triggerflow": `Flow Triggered from JS [${Math.random()}]`
				}
			);
			
			requests.push(requestTmp);
		}
		    

		
		Xrm.WebApi.online.executeMultiple(requests).then(
			function(result){
				
				console.log(`${result.status} ${result.statusText}`);
				selectedControl.refresh(); 
				Xrm.Utility.closeProgressIndicator();
				Xrm.Navigation.openAlertDialog({
					title: "Success",
					text: "Record(s) updated successfully!",
				});	
				
			},
			function(error){
				console.log(error.message);
				Xrm.Utility.closeProgressIndicator();
                Xrm.Navigation.openErrorDialog({ details: error.message, message: 'An error occurred while updating records.'});
			}
		);
		
		
	};	
		
	return {
		OpenCustomPage: openCustomPage,
		OpenCustomPageV2: openCustomPageV2,
		RunCustomApi: runCustomApi,
		ModifyTriggerFlow: modifyTriggerFlow
	}
})();