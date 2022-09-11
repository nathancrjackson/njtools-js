
//NJTools lazy ID helpers
window.njt.id = new (function()
{
	this.lazyUniqueID = Date.now();

	this.getLazyUniqueID = function ()
	{
		result = this.lazyUniqueID;
		this.lazyUniqueID++;
		return result;
	}
})();

//NJTools element building helpers
window.njt.element = new (function()
{
	this.createElement = function ( typeString, idString, classString, attrMap, innerHTMLString )
	{
		let element = null;

		if (window.njt.js.typeOf(typeString) === window.njt.types.STRING)
		{
			if (typeString === "")
			{
				return document.createTextNode(innerHTMLString);
			}

			element = document.createElement(typeString);

			if (window.njt.js.typeOf(attrMap) === window.njt.types.OBJECT)
			{
				let keys = Object.keys(attrMap);
				for (let i = 0, l = keys.length; i < l; ++i)
				{
					var key = keys[i];
					element.setAttribute(key, attrMap[key]);
				}
			}

			if (window.njt.js.typeOf(idString) === window.njt.types.STRING)
			{
				element.setAttribute('id', idString);
			}

			if (window.njt.js.typeOf(classString) === window.njt.types.STRING)
			{
				element.className = classString;
			}

			if (window.njt.js.typeOf(innerHTMLString) === window.njt.types.STRING)
			{
				element.innerHTML = innerHTMLString;
			}
		}

		return element;
	}

	this.wrapElement = function ( elementDefinition )
	{
		if (window.njt.js.typeOf(elementDefinition.w) === window.njt.types.OBJECT)
		{
			let wrapper = window.njt.element.createElement(elementDefinition.w.t, elementDefinition.w.i, elementDefinition.w.c, elementDefinition.w.a);
			wrapper.appendChild(elementDefinition);
			elementDefinition = wrapper;
		}

		return elementDefinition;
	}

	this.buildElementTree = function ( elementDefinition )
	{
		let element = null;

		if (window.njt.js.typeOf(elementDefinition) === window.njt.types.OBJECT)
		{
			element = this.createElement(elementDefinition.t, elementDefinition.i, elementDefinition.c, elementDefinition.a, elementDefinition.d);

			if (element !== null)
			{
				if (window.njt.js.typeOf(elementDefinition.e) === window.njt.types.ARRAY)
				{
					for (let i = 0; i < elementDefinition.e.length; i++)
					{
						let subElement = this.buildElementTree(elementDefinition.e[i]);

						if (subElement !== null) { element.appendChild(subElement); }
					}
				}

				element = this.wrapElement(element);
			}
		}

		return element;
	}

})();

//NJTools "snip" helpers
window.njt.snip = new (function()
{
	//Are we case-sensitive
	this.caseSensitive = false;

	//Our Regex
	this.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'gi');

	//Our key/value map
	this.valueMap = new Object();

	//Our id/snip map
	this.snipMap = new Object();

	//All variables detected
	this.vars = new Array();
	
	this.setCaseSensitive = function(isSensitive)
	{
		if (isSensitive == true)
		{
			window.njt.snip.caseSensitive = true;
			window.njt.snip.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'g');
		}
		else
		{
			window.njt.snip.caseSensitive = false;
			window.njt.snip.regex = new RegExp("\{:([a-zA-Z0-9=\.\-_]*):\}", 'gi');
		}
	};

	//How we add to that map
	this.valueMapPush = function(key, value)
	{
		if (this.caseSensitive) { this.valueMap[key] = value; }
			else { this.valueMap[key.toLowerCase()] = value; }
	};

	//How we reset the map
	this.valueMapDelete = function(key)
	{
		if (typeof this.valueMap[key] !== 'undefined') { delete this.valueMap[key]; }
	};

	//How we reset the map
	this.valueMapClear = function()
	{
		this.valueMap = new Object();
	};

	//Examine a string with snips
	this.examineString = function(snipString)
	{
		let result = new Array();
		
		let match = null;
		
		let matchString = null;
		
		while ((match = this.regex.exec(snipString)) !== null) {
			if (this.caseSensitive) { matchString = match[1]; }
				else { matchString = match[1].toLowerCase(); }
			if (result.indexOf(matchString) === -1) { result.push(matchString); }
			if (this.vars.indexOf(matchString) === -1) { this.vars.push(matchString); }
		}

		return result;
	};

	this.examineByID = function(snipID)
	{
		let result = new Array();

		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipID);

		if (nodeList.length === 1)
		{
			result = this.examineString(nodeList[0].innerHTML);
		}

		return result;
	};

	this.examineByGroup = function(snipGroup)
	{
		let result = new Array();

		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let currentSnip = this.examineString(nodeList[i].innerHTML);

				//result = [...new Set([...result, ...currentSnip])];

				//For IE Compatibility
				for (let j = 0; j < currentSnip.length; j++)
				{
				  if (result.indexOf(currentSnip[j]) == -1) result.push(currentSnip[j]);
				}
			}
		}

		return result;
	};

	//Process a string with snips
	this.processString = function(snipString)
	{
		//End result
		let result = "";
		
		//Variable markers
		let markers = new Array();
		
		//Find each variable and store a marker with it's location and length
		let match = null;
		while ((match = this.regex.exec(snipString)) !== null) {
			let marker = {};
			marker['i'] = match.index;
			marker['l'] = match[0].length;
			markers.push(marker);
		}

		//Starting at the start of the string
		index = 0;

		//For each marker we do have
		for (let i = 0; i < markers.length; i++) {
			let marker = markers[i];

			//Store anything between index and start of marker in result
			if (marker.i !== index)
			{
				result += snipString.substring(index, marker.i);
			}

			//Update our index
			index = marker.i + marker.l;

			//Grab the variable key
			let key = snipString.substring((marker.i + 2), (index - 2));	
			
			//Make it lowercase 
			if (!this.caseSensitive) { key = key.toLowerCase(); }

			//Check it against our map
			if(typeof this.valueMap[key] === 'undefined')
			{
				//Reinsert variable if no matching key found	
				result += "{:" + key + ":}";
			}
			else
			{
				//Insert our value if key found
				result += this.valueMap[key];
			}
		}

		//If there is anything left at the end add to our result
		if (index < snipString.length)
		{
			result += snipString.substring(index, snipString.length);
		}

		//Done
		return result;
	};

	this.processByID = function(snipID)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipID);

		if (nodeList.length === 1)
		{
			//Check it against our map
			if(typeof this.snipMap[snipID] === 'undefined')
			{
				//Store our original text in our snip map
				this.snipMap[snipID] = nodeList[0].innerHTML
			}

			nodeList[0].innerHTML = this.processString(this.snipMap[snipID]);
		}
	}

	this.processByGroup = function(snipGroup)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let snipID = nodeList[i].getAttribute('snip-id');

				//Check if attribute even set
				if (snipID === null)
				{
					//Maybe redo this later, for now this is how I'll do unique ID generation
					snipID = snipGroup + window.njt.id.getLazyUniqueID();
					nodeList[i].setAttribute("snip-id", snipID);
				}

				//Check it against our map
				if(typeof this.snipMap[snipID] === 'undefined')
				{
					//Store our original text in our snip map
					this.snipMap[snipID] = nodeList[i].innerHTML
				}

				nodeList[i].innerHTML = this.processString(this.snipMap[snipID]);
			}
		}
	}

	this.resetByID = function(snipID)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-id', snipID);

		if (nodeList.length === 1)
		{
			//Check it against our map
			if(typeof this.snipMap[snipID] !== 'undefined')
			{
				//Restore our original text in our snip map
				nodeList[0].innerHTML = this.snipMap[snipID];
			}
		}
	}

	this.resetByGroup = function(snipGroup)
	{
		let nodeList = window.njt.dom.getElementsByAttributeWithValue('snip-group', snipGroup);

		if (nodeList.length > 0)
		{
			for (let i = 0; i < nodeList.length; i++)
			{
				let snipID = nodeList[i].getAttribute('snip-id');

				//Check if attribute even set
				if (snipID !== null)
				{
					//Check attribute against our map
					if(typeof this.snipMap[snipID] !== 'undefined')
					{
						//Restore our original text in our snip map
						nodeList[i].innerHTML = this.snipMap[snipID];
					}
				}
			}
		}
	}

	//Initialise snip group by class and makeup an ID
	this.initByClass = function(className)
	{
		let count = 0;
		let nodeList = window.njt.dom.getElementsByClass(className);

		for (let i = 0; i < nodeList.length; i++)
		{
			if (nodeList[i].getAttribute('snip-group') === null && nodeList[i].getAttribute('snip-id') === null)
			{
				nodeList[i].setAttribute("snip-group", className);

				//Maybe redo this later, for now this is how I'll do unique ID generation
				snipID = className + window.njt.id.getLazyUniqueID();
				nodeList[i].setAttribute("snip-id", snipID);

				count++;
			}
		}

		return count;
	};

	//Initialise snip group and id by class
	//Format class as "snipGroup-snapID" with the snip group being the class prefix
	this.initByClassIDPair = function(classPrefix)
	{
		let count = 0;
		let nodeList = window.njt.dom.getElementsWhereClassBegins(classPrefix+'-');
		let minLength = classPrefix.length + 2;

		for (let i = 0; i < nodeList.length; i++)
		{
			for (let j = 0; j < nodeList[i].classList.length; j++)
			//for (let elementClass of nodeList[i].classList)
			{
				let elementClass = nodeList[i].classList[j];
				if (elementClass.length > minLength && elementClass.substring(0,classPrefix.length) === classPrefix)
				{
					if (nodeList[i].getAttribute('snip-group') === null && nodeList[i].getAttribute('snip-id') === null)
					{
						nodeList[i].setAttribute("snip-group", classPrefix);
						nodeList[i].setAttribute("snip-id", elementClass.substring(classPrefix.length + 1));

						count++;
					}
				}
			}
		}

		return count;
	};

})();

//NJTools Modal
window.njt.modal = new (function()
{
	this.initModal = function()
	{
		this.modalShell = document.createDocumentFragment();

		//Create the modal "background"
		let background = document.createElement('div');
		background.setAttribute('id', this.modalBackgroundID);
		background.setAttribute('modal-element', 'background');
		background.className = this.modalBackgroundClass;

		//Create the frame for the model
		let frame = document.createElement('div');
		frame.setAttribute("id", this.modalFrameID);
		frame.className = this.modalFrameClass;


		//Create the wrapper for the close span
		let spanwrap = document.createElement('div');
		spanwrap.setAttribute("id", this.modalCloseWrapperID);

		//Create a span to close
		let span = document.createElement('span');
		span.innerHTML = '&times;';
		span.className = this.modalCloseClass;
		span.setAttribute('id', this.modalCloseID);
		span.setAttribute('modal-element', 'close-button');

		//Create what holds the content
		let content = document.createElement('div');
		content.setAttribute('id', this.modalContentID);
		content.className = this.modalContentClass;

		//Link it all up
		spanwrap.appendChild(span);
		frame.appendChild(spanwrap);
		frame.appendChild(content);
		background.appendChild(frame);
		this.modalShell.appendChild(background);

		//Handle our click events nicely
		document.addEventListener('mousedown', function(event)
		{
			let modalElement = event.target.getAttribute('modal-element');

			if (modalElement !== null)
			{
				//Detect if horizontal scroll bars are in play
				//Might not work with Right to Left text
				if (event.offsetX < event.target.clientWidth) // || event.offsetY > event.target.clientHeight) 
				{
					window.njt.modal.lastClick = modalElement;
				}
			}
			else { window.njt.modal.lastClick = null; }
		});

		document.addEventListener('mouseup', function(event)
		{
			if (window.njt.modal.lastClick !== null)
			{
				let modalElement = event.target.getAttribute('modal-element');

				if (modalElement === window.njt.modal.lastClick)
				{
					if (modalElement === 'background' || modalElement === 'close-button')
					{
						//Detect if horizontal scroll bars are in play
						//Might not work with Right to Left text
						if (event.offsetX < event.target.clientWidth) 
						{
							window.njt.modal.close(event);
						}
					}
				}

				window.njt.modal.lastClick = null;
			}
		});
	}
	
	this.loadModals = function()
	{
		let modalArray = document.querySelectorAll('[modal-wrapper]');
		let currentID = null;
		let currentOpen = null;
		let currentClose = null;
		let numModals = modalArray.length;
		for (let i = 0; i < modalArray.length; i++)
		{
			currentID = modalArray[i].getAttribute("modal-wrapper");
			currentOpen = modalArray[i].getAttribute("modal-open");
			currentClose = modalArray[i].getAttribute("modal-close");
			currentChildren = modalArray[i].children;

			this.contentArray[currentID] = {};
			this.contentArray[currentID].modal = document.createDocumentFragment();
			while (currentChildren.length > 0)
			{
				this.contentArray[currentID].modal.appendChild(currentChildren[0]);
			}

			if (typeof currentOpen == "string")
				{ this.contentArray[currentID].open = currentOpen; }
			else
				{ this.contentArray[currentID].open = null; }

			if (typeof currentClose == "string")
				{ this.contentArray[currentID].close = currentClose; }
			else
				{ this.contentArray[currentID].close = null; }
			
			modalArray[i].parentNode.removeChild(modalArray[i]);
		}
	}

	this.open = function(contentID, event)
	{
		window.njt.log('Trying To Open Modal');

		if (this.contentArray[contentID].open != null)
		{
			window.njt.log('Running Custom Open Modal Function');
			window.njt.modal.openFunctions[this.contentArray[contentID].open](contentID, event);
		}
		else
		{
			this.openNow(contentID);
		}
	}

	this.openNow = function(contentID)
	{
		window.njt.log('Modal Open Started');

		if
		(
			this.currentContentID === null &&
			typeof contentID === "string" &&
			typeof this.contentArray[contentID] !== "undefined"
		)
		{
			//IE Didn't like this: window.njt.modal.modalShell.getElementById(this.modalContentID).appendChild(this.contentArray[contentID]);
			window.njt.modal.modalShell.querySelector('#'+this.modalContentID).appendChild(this.contentArray[contentID].modal);
			document.body.appendChild(this.modalShell);
			this.currentContentID = contentID;
		}
		window.njt.log('Modal Open Ended');
	}

	this.close = function(event)
	{
		window.njt.log('Trying To Close Modal');

		if (this.contentArray[this.currentContentID].close != null)
		{
			window.njt.log('Running Custom Close Modal Function');
			window.njt.modal.closeFunctions[this.contentArray[this.currentContentID].close](event);
		}
		else
		{
			this.closeNow();
		}

	}

	this.closeNow = function()
	{
		window.njt.log('Modal Close Started');
		if (this.currentContentID !== null)
		{
			//Load the modal content back into its array
			let content = document.getElementById(this.modalContentID);
			while (content.childNodes.length > 0)
			{
				this.contentArray[this.currentContentID].modal.appendChild(content.childNodes[0]);
			}
			//Grab the background and put it back into the modal shell fragment
			this.modalShell.appendChild(document.getElementById(this.modalBackgroundID));

			this.currentContentID = null;
		}
		window.njt.log('Modal Close Ended');
	}

	this.modalShell = null;
	this.currentContentID = null;
	this.contentArray = [];
	this.modalBackgroundID = 'modal-background';
	this.modalBackgroundClass = 'modal-background';
	this.modalFrameID = 'modal-frame';
	this.modalFrameClass = 'modal-frame';
	this.modalCloseWrapperID = 'modal-close-wrapper';
	this.modalCloseID = 'modal-close-button';
	this.modalCloseClass = 'modal-close';
	this.modalContentID = 'modal-content';
	this.modalContentClass = 'modal-content';

	this.lastClick = null;
	this.contentArray = [];
	this.openFunctions = {};
	this.closeFunctions = {};

	window.njt.event.queue['htmlloaded'].push(function()
	{
		window.njt.log('Starting to initialise Modals');
		window.njt.modal.initModal();
		window.njt.modal.loadModals();
		window.njt.log('Finished initialising Modals');
	});

})();

//NJTools Form Builder
window.njt.formbuilder = new (function()
{
	this.generate = function ( input )
	{
		let form = null;

		if (window.njt.js.typeOf(input) === window.njt.types.STRING)
		{
			input = JSON.parse( input );
		}

		if (input.t === "njt/form")
		{
			form = window.njt.element.createElement('form', input.i, input.c, input.a);

			if (window.njt.js.typeOf(input.e) === window.njt.types.ARRAY)
			{
				for (let i = 0; i < input.e.length; i++)
				{
					let element = null;
					let currentItem = input.e[i];
					let typePath = input.e[i].t.split('/');

					if (typePath.length === 3)
					{
						if (typePath[0] === 'njt' && typePath[1] === 'form')
						{
							if (window.njt.js.typeOf(this.typeBuilders[typePath[2]]) === window.njt.types.FUNCTION)
							{
								element = this.typeBuilders[typePath[2]](input.e[i]);
							}
						}
					}
					else if (typePath.length === 1)
					{
						element = window.njt.element.buildElementTree(input.e[i]);
					}

					if (element !== null) { form.appendChild(element); }
				}
			}

			if (window.njt.js.typeOf(input.w) === window.njt.types.OBJECT)
			{
				let wrapper = window.njt.element.createElement(input.w.t, input.w.i, input.w.c, input.w.a);
				wrapper.appendChild(form);
				form = wrapper;
			}

		}

		return form;
	}

	this.typeBuilders = {};

	/*

	input.i = input ID and name
	input.l = input label
	input.p = input placeholder
	input.c = wrapper div class
	input.v = option values
	input.s = selected value

	*/

	this.typeBuilders['lineinput'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'type': 'text',
				'class': 'njt-form-lineinput',
				'name' : baseId
			};

			if (window.njt.js.typeOf(input.p) === window.njt.types.STRING)
			{
				fieldAttr['placeholder'] = input.p;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('input', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

	this.typeBuilders['multilineinput'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'class': 'njt-form-multilineinput',
				'name' : baseId
			};

			if (window.njt.js.typeOf(input.p) === window.njt.types.STRING)
			{
				fieldAttr['placeholder'] = input.p;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('textarea', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

	this.typeBuilders['dropdown'] = function( input )
	{
		let result = null;

		if (window.njt.js.typeOf(input.i) === window.njt.types.STRING)
		{
			let label = input.l;
			let baseId = input.i;
			let fieldAttr = {
				'class': 'njt-form-dropdown',
				'name' : baseId
			};

			let selected = null;
			if (window.njt.js.typeOf(input.s) === window.njt.types.STRING)
			{
				selected = input.s;
			}

			result = window.njt.element.createElement('div', baseId+'-wrapper', input.c);

			let field = window.njt.element.createElement('select', baseId+'-input', null, fieldAttr);

			if (window.njt.js.typeOf(input.v) === window.njt.types.ARRAY)
			{
				for (let i = 0; i < input.v.length; i++)
				{
					if (input.v[i].v === selected)
					{
						field.appendChild(window.njt.element.createElement('option', null, null, {"value":input.v[i].v, "selected": 1}, input.v[i].d));
					}
					else
					{
						field.appendChild(window.njt.element.createElement('option', null, null, {"value":input.v[i].v}, input.v[i].d));
					}
				}
			}

			if (window.njt.js.typeOf(input.l) === window.njt.types.STRING)
			{
				let label = window.njt.element.createElement('label', baseId+'-label', null, {"for":baseId+'-input'}, input.l + field.outerHTML);
				result.appendChild(label);
			}
			else
			{
				result.appendChild(field);
			}
		}

		return result;
	}

})();
