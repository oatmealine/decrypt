"use strict";

String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

const Decryption = {
	"getPassCode": function(string) {
		// grab a number as the result
		let result = 0;

		string = new String(string);

		// run this "conversion" for each character, that way its almost impossible to decode the password
		for (let i = 0; i < string.length; i++) {
			// add the char code of the character to the result
			result = result + string.charCodeAt(i);
		}

		return result * (1 + string.charCodeAt(0));
	},

	"encryptString": function(data, header, ipLink, password = "", fileExtension = null) {
		// remove the data if its just a space
		if(data === " ") data = "";
		
		// create a blank pass for encrypting the headers
		let pass = this.getPassCode(password);
		let blankpass = this.getPassCode("");

		// add the headers (the header name, iplink and a small encoding test via "ENCODED" encrypted with the password)
		let result = "#DEC_ENC::"
		+ this.encrypt(header, blankpass) + "::"
		+ this.encrypt(ipLink, blankpass) + "::"
		+ this.encrypt("ENCODED", pass);

		// add the file extension to the headers only if it exists
		if(fileExtension !== null) {
			result = result + "::" + this.encrypt(fileExtension, blankpass);
		} else {
			result = result + "::" + this.encrypt(".txt", blankpass);
		}

		// encrypt the acutal data
		result = result + "::\n\n" + this.encrypt(data, pass); 
  
		return result;
	},
	
	"encrypt": function(data, password="") {
		// grab an array as the result
		let resultarr = [];

		// run this for each bit of data and serprate it by spaces
		for (let i = 0; i < data.length; i++) {
			//get the charcode of the character we need, multiply and add a number + add the password
			let num = data.charCodeAt(i) * 1822 + 32767 + this.getPassCode(password);
			// push the result of that to the result array
			resultarr.push(num);
		}

		// serprate the result arr by spaces and were good to go
		return resultarr.join(" ");
	},

	"getHeaders": function(data) {
		// split the data by :: dividers
		let dataarr = data.split("::");
		let headerData = dataarr.splice(1,3);
		let resultarr = [];

		// headerData[0] is the header name
		// headerData[1] is the source IP
		// headerData[2] is the extension (if exists, else "ENCODED" check)


		resultarr[0] = this.decrypt(headerData[0]);
		resultarr[1] = this.decrypt(headerData[1]);
		if(this.decrypt(headerData[2]).startsWith(".")) {
			resultarr[2] = this.decrypt(headerData[2]);
		}

		return resultarr;
	},

	"validData": function(data) {
		// check for the amount of headers and #DEC_ENC at the start

		// split the data by :: dividers
		let dataarr = data.split("::");

		//return all the checks' bools
		return dataarr.length === 6 && dataarr[0] === "#DEC_ENC";
	},

	"validPassword": function(data, pass="") {
		// check the 5th header and decypher it with the pass
		// if the result is "ENCODED", it's a valid pass

		// split the data by :: dividers
		let dataarr = data.split("::");

		//decrypt and check the header
		return this.decrypt(dataarr[3], pass) === "ENCODED";
	},

	"decryptString": function(data, pass="") {
		// split the data by :: dividers
		let dataarr = data.split("::");

		//check if the data given is valid
		if(!this.validData(data)) return "INVALID_DECFILE";

		// check if the password given is valid
		if(!this.validPassword(data, pass)) return "INVALID_PASSWORD";

		// return the result
		return this.decrypt(dataarr[dataarr.length-1], pass);
	},

	"decrypt": function(data, password="") {
		// split the data by each 'sub-data'
		let dataarr = data.split(" ");

		// make a passcode out of the password to use for decrypting
		// no need for checking the passcode, thats handled by decryptString()
		let passcode = this.getPassCode(password);

		// the results array (will be turned into a full string later)
		let resultarr = [];

		// decode each 'sub-data'
		for (let i = 0; i < dataarr.length; i++) {
			// reverse the encrypt process to get the charcode
			let charcode = (Number(dataarr[i]) - this.getPassCode(passcode) - 32767) / 1822;
			// convert charcode to character
			let character = String.fromCharCode(charcode);
			resultarr.push(character);
		}
		
		return resultarr.join("");
	}
};

module.exports = Decryption;