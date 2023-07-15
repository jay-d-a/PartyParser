# PartyParser
<<<<<<< Updated upstream
## JS XML parser, builder and loopers
=======

### JS XML parser, builder and looper
## Synchronous
Currently only have synchronous process.

### Parse
To parse XML just provide it to the object xmlParse and use method.parse() and access the JSON returned.
```js

const { xmlParser } = require('partyparser');

var xml = `<person title="Mr"><name>James</name><age>21</age></person>`;

var parsed = new xmlParser(xml).parse();

```

Parsed will be an array of elements containing the siblings, in each element we have an element array for children, I wouldn't worry about the structure though as the object has a builder to abstract this. the above would create JSON like the below which can be access by the returned value or the property xml.
```js

{

    'elements': [

        {

            'person': {

                'value': '',

                'attributes': {

                    'title': 'Mr'

                },

                elements: [

                    {

                        'name': {

                            'value': 'james',

                            'attributes': {},

                            'elements': []

                        }

                    },

                    {

                        'age': {

                            'value': '21',

                            'attributes': {},

                            'elements': []

                        }

                    }

                ]

            }

        }

    ]

}

```
Seems like a nightmare to navigate but we can use the looping object to navigate this a bit easier, jump to looping now if you must :).

so we have seen parsing to JSON but we can also do the opposite with .build(), this will accept a JSON with the above format and convert to xml.

```js 
const { xmlParser } = require('partyparser');
var json = {} //Like the above example
var parsed = new xmlParser(json).build();
```

and the out put of this will be, now with line breaks and tabs:
```xml
<person title="Mr">\n\t<name>James</name>\n\t<age>21</age>\n</person>
```

This can be accessed from the returned or by the objects xml property;

### Building
We can easily create a xml object with below methods
```js
const { xmlParser } = require('partyparser');
var newXml = new xmlParser(json);
newXml.open('person', {'title': 'Mr'});
newXml.add('name', 'James');
newXml.add('age', {'countriesDrinkingAge': '18'}, 21);
newXml.close('person');
var xmlResult = newXml.build();
```

opening a tag will add a tag and move our position into it so any more tags we make will be a child, add will only create the tag, we will stay in the same tag as before. both methods accept name, attributes and value. if attributes can be value if a string and value is unset.

The close method will push us out of the tag, we do not need to close every tags the JSON doesn't keep track of that, if you are multiple tags deep such as:
```xml
<root><child><child2>
```
You can close any of the tags and you will be moved appropriately so closing child will close child 2 putting us back to root.

#### All methods
* addValue(val) will add to the value
* setValue(val) will clear and set the value
* attribute(label, value) will add an attribute
* attributes({}) will add multiple attributes
* removeAttribute(label) will remove the attribute
* addCData(val) can be used to add cdata to the value, 
> [!warning] CData is interesting as you can do addValue addCData and addValue, and the value would have the cdata tag within, though im not sure how this would play with external systems not using partyparser.

### Looping
For this parser i have created a object for easier navigation of the parsed xml.

There's 2 ways to start a loop, from the parser, from the loop object and from the parser object. .next() is used to loop the tags, it will loop how you would expect the xml to be looped through.
#### Parser object:
```js
const { xmlParser } = require('partyparser');
var xml = `<person title="Mr"><name>James</name><age>21</age></person>`;
var parsed = new xmlParser(xml).parse();

var loop = parsed.startLoop();
while (loop.next()) {
	loop.getName();
}
```

#### Loop object:
```js
const { xmlJsonLoop } = require('partyparser');
json = {}; //like previous json example
var loop = new xmlJsonLoop(json);
while (loop.next()) {
	loop.getName();
}
```
#### Methods
* getValue() will retrieve current tags value
* getCleanValue() converts the CDATA to just their text
* getAttribute(label) will get the attributes value
* getAttributes() will get an object of attributes and their values
* getChildCount() will return how many children the tag has
* hasChildren() returns Boolean of whether a child tag exists
* skipToSibling() will make the next record the sibling of the current record rather than the children
* stop() will stop the loop
 
### Tag Builder
a simple object to build tags, used by .build() in xmlParser to make xml tags

#### Usage
```js
const { tagBuilder } = require('partyparser');
var newTag = new tagBuilder('person', {'title': 'Mr'}, false);
newTag.attribute('age', '21');
var tag = newTag.build();
```

the object accepts tag name, attributes and closed boolean on creation. name and attributes is obvious but closed is used to define if the tag should close immediately like:
```xml
<person title="Mr" age="21"/>
```
where as by default it is false and would generate the below
```xml
<person title="Mr" age="21"/>
```

if you want to generate a closed tag just set name to /name
```xml
</person title="Mr" age="21">
```

#### Methods
* attribute(label, value) adds an attribute
* attributes({}) adds multiple attributes
* setAttributes({}) removes all attributes and adds new based on object
* removeAttribute(label) removes an attribute
* setName() sets the tag name
* setClosed() adds / to end of tag if true
>>>>>>> Stashed changes
