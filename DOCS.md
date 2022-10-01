# Documentation

## Core classes

### njt.js

JavaScript helpers.

#### _typeOf(var)_

Returns strict window.njt.types enum of var type.

#### _validate(object, map)_

Iterates through map checking against the first level of object for matching variables of window.njt.types enum value.

#### _getRandomInt(min, max)_

Get a random integer between min and max (both inclusively).

---

### njt.dom

DOM helpers.

#### _getElementById(string)_

Find a DOM object that has an Id matching string. Essentially an alias of document.getElementById that is here to complete the set.

#### _getElementsByAttribute(string)_

Find all DOM objects that have an attribute matching string.

#### _getElementsByAttributeWithValue(attributeString, valueString)_

Find all DOM objects that have the attribute matching attributeString with the value matching valueString.

#### _getElementsByClass(string)_

Find all DOM objects that have the class matching string.

#### _getElementsWhereClassContains(string)_

Find all DOM objects that have a class containing string.

#### _getElementsWhereClassBegins(string)_

Find all DOM objects that have a class beginning with string.

#### _getElementsWhereClassEnds(string)_

Find all DOM objects that have a class ending with string.

---

### njt.req

AJAX helpers.

#### _get(pathString, onloadFunction)_

Make a simple GET request to URL pathString and call function onloadFunction when done which will have the reply responseText passed into it.

#### _post(pathString, postData, onloadFunction)_

Make a simple POST request to URL pathString sending postData and call function onloadFunction when done which will have the reply responseText passed into it.

---

### njt.event

Event helpers.

#### _eventHandler(event)_

Add as a listener to DOM object for event to be handled by HTML attributes and function map.

#### _addFunction(name, function)_

Add function to function map which can be referenced by name.

#### _createQueue(queueNameString, eventObject, eventNameString)_

Create a listener queue called queueNameString which waits for eventObject to emit an event named eventNameString.

#### _queueWrapper(object, eventListenerName)_

Used by createQueue to wrap events before placing them in the appropriate queue\[nameString\].

#### _queue\[nameString\].push(function)_

Adds function to listener queue called nameString.

#### _triggerSyntheticEvent(eventObject, eventListenerName, eventDetails)_

Triggers a custom event on eventObject which has the name eventListenerName and adds eventDetails to the emitted Event object's detail property.

---

## Extension classes

### njt.id

Very basic IDs.

#### _getLazyUniqueID()_

Returns simple ID based on date. This is used by _njt.snip_.

---

### njt.element

Element building functions.

#### _createElement(typeString, idString, classString, attrMap, innerHTMLString)_

Create a DOM object of the element type typeString.

#### _wrapElement(wrapperDefinition, elementObject)_

Create a DOM object based on wrapperDefinition and make elementObject its child element.

#### _buildElementTree(elementDefinition)_

Create a tree of DOM objects based on the object elementDefinition.

#### _elementDefinition_

The structure of an elementDefinition is:
- t: Element type (use empty string for text only)
- i: Element ID attribute
- c: Element Class attribute
- a: Map of element attributes (can put ID and Class in here too)
- e: Child elements
- w: Wrapper element
- h: innerHTML string

---

### njt.snip

Process strings with variables that use {:this:} notation.

#### _setCaseSensitive(isSensitive)_

Sets whether variables are case-sensitive or not.

#### _valueMapPush(key, value)_

Loads a value for a variable into the value map.

#### _valueMapDelete(key)_

Deletes a variable from the value map.

#### _valueMapClear()_

Clears the value map.

#### _examineString(snipString)_

Examines the string snipString and returns an array of all variables found.

#### _examineByID(snipID)_

Examines the innerHTML of an element where the attribute snip-id is set to snipID and returns an array of all variables found.

#### _examineByGroup(snipGroup)_

Examines the innerHTML of elements where the attribute snip-group is set to snipGroup and returns an array of all variables found.

#### _processString(snipString)_

Processes the contents of snipString and replaces variables with their associated value from the value map.

#### _processByID(snipID)_

Processes the contents of an element where the attribute snip-id is set to snipID and replaces variables with their associated value from the value map.

#### _processByGroup(snipGroup)_

Processes the contents of elements where the attribute snip-group is set to snipGroup and replaces variables with their associated value from the value map.

#### _resetByID(snipID)_

Resets the contents of an element where the attribute snip-id is set to snipID back to its original content.

#### _resetByGroup(snipGroup)_

Resets the contents of elements where the attribute snip-group is set to snipGroup back to its original content.

#### _initByClass(className)_

Finds all elements with the class of classname, set the snip-group attribute to be className and makes up a snip-id using _njt.id.getLazyUniqueId()_.

#### _initByClassIDPair(classPrefix)_

Finds all elements with a class matching classPrefix-\*, sets the snip-group attribute to be classPrefix and sets the snip-id be whatever the * value is.

---

### njt.modal

Handles the initialisation, opening and closing of models.

#### _initModal()_

Triggered once the html is loaded to create and setup the modal shell.

#### _loadModals()_

Triggered once the html is loaded after initModal is called to process any modals defined in the page.

#### _open(contentID, event)_

Opens the modal named contentID. If there is a custom open function defined for modal it will call that otherwise it will call openNow().

#### _openNow(contentID)_

Directly opens modal named contentID.

#### _close()_

Closes the modal named contentID. If there is a custom close function defined for modal it will call that otherwise it will call closeNow().

#### _closeNow()_

Directly closes the current modal.

---

### njt.formbuilder

Generate HTML forms using JSON definitions .

#### _generate(input)_

Generates form defined in input.

#### _typeBuilders\[type\](input)_

Generates a block named type defined in input.
