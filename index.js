/*jshint esversion: 6 */

(function(){
	'use strict';

	const ncp = require('copy-paste-win32fix');
	const convert = require('convert-units');

	module.exports = (pluginContext) => {

		//This controls the number of decimal places in the output answer
		const NUMBER_OF_DECIMAL_PLACES = 4;

		const toast = pluginContext.toast;
		const logger = pluginContext.logger;
		const app = pluginContext.app;

		function search(query, res) 
		{
			const query_trim = query.trim();
			const qs = query_trim.split(" ");

			if (query_trim.length === 0) {
	      		return res.add({
	      			id: 'invalid',
	      			payload: 'no data',
	      			title: 'Please enter the measurement you\'d like to convert',
	      			desc: 'e.g. 70 m ft'
	      		});
	    	}

	    	const is_valid_amt = !(isNaN(qs[0]));
	    	
	    	if(!is_valid_amt){
	    		return res.add({
	    			id: 'invalid',
	    			payload: 'bad number',
	    			title: query_trim,
	    			desc: 'Cannot convert ' + qs[0]
	    		});
	    	}

	    	if (qs.length < 2){
	    		return res.add({
	    			id: 'invalid',
	    			payload: 'too few arguments',
	    			title: query_trim,
	    			desc: 'Converting...'
	    		});
	    	}

	    	if (qs.length > 3 ){
	    		return res.add({
	    			id: 'invalid',
	    			payload: 'too many arguments',
	    			title: query_trim,
	    			desc: 'Too many arguments!'
	    		});
	    	}
			
			var result, f, t;
			f = qs[1];
			
			if(qs.length == 2)
				t = convert(qs[0]).from(f).toBest().unit;
			else
				t = qs[2];
			
			result = convert(qs[0]).from(f).to(t);
			
			res.add({
				id: 'done',
				payload: result,
				title: `${qs[0]} ${qs[1]} = ${result} ${t}`,
				desc: `Press Enter to copy ${result} to clipboard`
			});
			return;
		}

		function execute(id, payload){
			if (id != 'done'){
				return;
			}

			ncp.copy(payload, () => {
				toast.enqueue(`Successfully copied ${payload} to the clipboard!`);
				app.setQuery("");
			});
		}

		return { search, execute };
	};
})();