window.onload=function() {
	document.getElementById("post-link").addEventListener("focusout", checkLink);
	document.getElementById("name").addEventListener("focusout", checkAccountName);
	document.getElementById("amount").addEventListener("focusout", checkSendAmount);

	document.getElementById("submitBtn").addEventListener("click", finalCheck);

	var randomTotalValue = Math.floor(Math.random() * 51) + 50;
	document.getElementById("total-value").innerHTML = "$ " + randomTotalValue;

	var randomAvailableValue = Math.floor(Math.random() * 51);
	document.getElementById("available-value").innerHTML = "$ " + randomAvailableValue;
}


function checkLink(event) {

	var inputObject = document.getElementById("post-link");
	var linkValue = inputObject.value;
	// console.log(linkValue);

	var errorObject = document.getElementById("linkSpan");

	var curationObject = document.getElementById("curation");
	//console.log(curationValue);

	var linkRegex = /^https:\/\/steemit.com\//i;

	var randomCuration = Math.floor(Math.random() * 26);


	if (linkValue.match(linkRegex)) {
		console.log("Link is Valid");
		inputObject.style.border = "none";

		curationObject.innerHTML = randomCuration + " %";

		errorObject.innerHTML = "";

		return true;
	} else {
		inputObject.style.border = "1px solid red";

		errorObject.innerHTML = "Make sure you've input a valid URL of your Steemit post";

		return false;
	}
}

function checkAccountName(event) {

	var inputObject = document.getElementById("name");
	var accountName = document.getElementById("name").value;

	var errorObject = document.getElementById("nameSpan");

	var nameRegex = /\w/;

	if (accountName.match(nameRegex)) {
		console.log("Name is Valid");
		inputObject.style.border = "none";
		errorObject.innerHTML = "";
		return true;
	} else {
		inputObject.style.border = "1px solid red";

		errorObject.innerHTML = "Make sure you've input a valid Steemit account name (no @ sign)";
		return false;
	}


}


function checkSendAmount(event) {

	var inputObject = document.getElementById("amount");
	var sendAmount = document.getElementById("amount").value;

	var voteValueObject = document.getElementById("vote-value");

	var errorObject = document.getElementById("amountSpan");

	var voteValue = sendAmount * 2;
	voteValue = voteValue.toFixed(2);
	console.log(voteValue);

	var amountRegex = /\d\.\d\d\d$/;

	if (sendAmount.match(amountRegex)) {
		console.log("Amount is Valid");
		inputObject.style.border = "none";

		voteValueObject.innerHTML = "$ " + voteValue;
		errorObject.innerHTML = "";

		return true;
	} else {
		inputObject.style.border = "1px solid red";
		voteValueObject.innerHTML = "$ 0";

		errorObject.innerHTML = "Use 3 decimal places";
		return false;
	}

}




function finalCheck(event) {

	checkLink(); 
	checkAccountName();
	checkSendAmount();

	if (checkLink() && checkAccountName() && checkSendAmount()) {
		alert("Your buy order has been placed!");
	} else {
		event.preventDefault();
	}
}
     