class xmlParser {
    constructor(data) {
        if (typeof data === "object") {
            var json = data;
        } else {
            var xml = data;
        }
        this.json = json || { "elements": [] };
        this.xml = xml || "";

        this.position = [this.json];
        this.closingTags = [];
    }

    isOpenTag(value) {
        return /<[A-z0-9._\-]:?[A-z0-9._\-]*.*\/{0}>/g.test(value);
    }

    isClosedTag(value) {
        return /<[A-z0-9._\-]:?[A-z0-9._\-]*.*\/>/g.test(value);
    }

    isClosingTag(value) {
        return /<\/[A-z0-9._\-]:?[A-z0-9._\-]*.*\/{0}>/g.test(value);
    }

    isDataTag(value) {
        return /<!\[CDATA\[.*]]>/g.test(value);
    }

    add(tag, attributes, value) {
        if (!tag) {
            throw new Error('Tag name not provided!');
        }
        if (typeof attributes !== "object") {
            value = value || attributes;
            attributes = [];
        }

        var last = this.position.length - 1;
        var newobj = {};
        newobj[tag] = {
            "value": value || "",
            "attributes": attributes || {},
            "elements": []
        };
        this.position[last]['elements'].push(newobj);
    }

    open(tag, attributes, value) {
        var last = this.position.length - 1;
        this.add(tag, attributes, value);
        this.closingTags.push("</" + tag + ">");

        var newLast = this.position[last]["elements"].length - 1;
        this.position.push(
            this.position[last]["elements"][newLast][tag]
        );
    }

    close(tag) {
        var closing = "</" + tag + ">";
        var closePosition = this.closingTags.lastIndexOf(closing);
        this.position.splice(closePosition + 1);
        this.closingTags.splice(closePosition);
    }

    addValue(value) {
        var last = this.position.length - 1;
        this.position[last].value += value;
    }

    setValue(value) {
        var last = this.position.length - 1;
        this.position[last].value = value;
    }

    attribute(label, value) {
        var last = this.position.length - 1;
        this.position[last]['attributes'][label] = value;
    }

    attributes(attributes) {
        for (var attribute in attributes) {
            this.attribute(attribute, attributes[attribute]);
        }
    }

    removeAttribute(label) {
        var last = this.position.length - 1;
        delete this.position[last]['attributes'][label];
    }

    addCData(value) {
        this.addValue("<![CDATA[" + value + "]]>");
    }

    parseTag(fullTag) {
        var inString = false;
        var currentStringSymbol = "";
        fullTag = fullTag.slice(1, fullTag.length - 1) + " ";
        var start = 0;
        var parsed = [];
        for (var position = 0; position < fullTag.length; position++) {
            var current = fullTag.charAt(position);
            var previous = fullTag.charAt(position - 1);
            if (previous != "\\" && current == " " && !inString) {
                parsed.push(fullTag.slice(start, position));
                start = position + 1;
            } else if (previous != "\\" && ["'", "`", '"'].indexOf(current) != -1) {
                if (currentStringSymbol == "" || currentStringSymbol == current) {
                    inString = !inString;
                    currentStringSymbol = current;
                    if (!inString) {
                        currentStringSymbol = "";
                    }
                }
            };
        }

        var name = parsed[0].charAt(0) == "/" ? parsed[0].slice(1,) : parsed[0];
        var attributes = parsed.splice(1);
        var attributeObj = {};
        for (var attribute in attributes) {
            var fullAttribute = attributes[attribute];
            var splitAttribute = fullAttribute.split('=');
            var label = splitAttribute[0];
            var value = splitAttribute.splice(1).join('=');
            if (value.length > 0) {
                attributeObj[label] = value.slice(1, value.length - 1);
            }
        }

        return {
            "name": name,
            "attributes": attributeObj
        };
    }

    cleanXML(xml) {
        xml = xml || this.xml;

        //trim but global
        xml = xml.replace(/\n {2,}/g, "\n");

        //remove blank lines
        xml = xml.replace(/\n?^\s*$\n?/gm, "");

        //remove comments
        xml = xml.replace(/<!--.*-->/g, "");

        var tagsOnSameLine = xml.match(/>.*</g);
        for (var match in tagsOnSameLine) {
            match = tagsOnSameLine[match];
            var removedTagsOnSameLine = ">\n" + match.slice(1,);
            xml = xml.replace(match, removedTagsOnSameLine);
        }

        var textBeforeTag = xml.match(/<{0}.+\/{0}</g);
        for (var match in textBeforeTag) {
            match = textBeforeTag[match];
            var removedTextBeforeTag = match.slice(0, match.length - 1) + "\n<";
            xml = xml.replace(match, removedTextBeforeTag);
        }

        var textAfterTag = xml.match(/\/{0}>.+$/gm);
        for (var match in textAfterTag) {
            match = textAfterTag[match];
            var removedTextAfterTag = ">\n" + match.slice(1,);
            xml = xml.replace(match, removedTextAfterTag);
        }

        //trim but global
        xml = xml.replace(/^ {1,}/gm, "");

        return this.xml = xml;
    }

    parse(xml) {
        xml = xml || this.xml;
        xml = this.cleanXML();

        var lines = xml.split('\n');
        for (var line in lines) {
            var value = lines[line];
            if (this.isDataTag(value)) {
                this.addValue(value);
            } else if (this.isClosedTag(value)) {
                var tag = this.parseTag(value);
                this.add(tag.name, tag.attributes);

            } else if (this.isOpenTag(value)) {
                var tag = this.parseTag(value);
                this.open(tag.name, tag.attributes);

            } else if (this.isClosingTag(value)) {
                var tag = this.parseTag(value);
                this.close(tag.name);

            } else {
                this.addValue(value);
            }
        }

        return this.json;
    }

    build(json) {
        json = json || this.json;
        var loop = new xmlJsonLoop(json);
        this.xml = "";
        var opened = [];
        var tab = "\t";
        while (loop.next()) {
            if (loop.closed[0]) {
                for (var close in loop.closed) {
                    this.xml += "\n" + tab.repeat(opened.length - 1) + new tagBuilder("/" + loop.closed[close]).build();
                    opened.shift();
                }
                loop.closed = [];
            }

            if (loop.getValue().length > 0 || loop.hasChildren()) {
                this.xml += "\n" + tab.repeat(opened.length) + new tagBuilder(loop.getName(), loop.getAttributes()).build();
                opened.unshift(loop.getName());
            } else {
                this.xml += "\n" + tab.repeat(opened.length) + new tagBuilder(loop.getName(), loop.getAttributes(), true).build();
            }

            if (loop.getValue().length > 0) {
                this.xml += loop.getValue();
            }
        }
        for (var open in opened) {
            this.xml += "\n" + tab.repeat(opened.length - 1 - open) + new tagBuilder("/" + opened[open]).build();
        }

        var valueFormatIssue = this.xml.match(/[^>]\n\t*<\//g);
        for (var match in valueFormatIssue) {
            var fixed = valueFormatIssue[match].replace(/\n\t*/g, '');
            this.xml = this.xml.replace(valueFormatIssue[match], fixed);
        }

        this.xml = this.xml.replace(/^\n/g, '');

        return this.xml;
    }

    startLoop() {
        return new xmlJsonLoop(this.json);
    }
}

class xmlJsonLoop {
    constructor(json) {
        this.json = json;
        this.position = [[json, 0]];
        this.current = "";
        this.closed = [];
        this.stopped = false;
    }

    next() {
        if (this.stopped) {
            return false;
        }

        var last = this.position.length - 1;
        var current = this.position[last][0];
        var count = this.position[last][1];
        if (current['elements'][count]) {

            var element = current['elements'][count];
            for (var name in element) {
                this.current = name;
                this.position.push([element[name], 0]);
            }
            this.position[last][1]++;
            if (current['elements'][count - 1]) {
                var element = current['elements'][count - 1];
                for (var name in element) {
                    if (current['elements'][count - 1][name]['elements'].length > 0 || current['elements'][count - 1][name]['value'].length > 0) {
                        this.closed.push(name);
                    }
                }
            }
            return true;

        } else {

            if (current === this.json) {
                return false;
            }

            this.position.pop();
            if (current['elements'][count - 1]) {
                var element = current['elements'][count - 1];
                for (var name in element) {
                    if (current['elements'][count - 1][name]['elements'].length > 0 || current['elements'][count - 1][name]['value'].length > 0) {
                        this.closed.push(name);
                    }
                }
            }
            return this.next();
        }
    }
    
    getName() {
        return this.current;
    }
    
    getValue() {
        var last = this.position.length - 1;
        return this.position[last][0]['value'];
    }
    
    getCleanValue() {
        var last = this.position.length - 1;
        var matches = this.getValue().match(/<!\[CDATA\[.*?]]>/g);
        var result = this.position[last][0]['value'];
        
        for (var match in matches) {
            match = matches[match];
            var data = match.replace(/^<!\[CDATA\[/g, '').replace(/\]\]>$/g, '');
            result = result.replaceAll(match, data);
        }
        
        return result;
    }
    
    getAttributes() {
        var last = this.position.length - 1;
        return this.position[last][0]['attributes'];
    }
    
    getAttribute(attribute) {
        var last = this.position.length - 1;
        return this.position[last][0]['attributes'][attribute] || undefined;
    }
    
    getChildCount() {
        var last = this.position.length - 1;
        return this.position[last][0]['elements'].length;
    }
    
    hasChildren() {
        return this.getChildCount() > 0;
    }
    
    skipToSibling() {
        this.position.pop();
    }

    stop() {
        this.stopped = true;
    }
}

class tagBuilder {
    constructor(name, attributes, closed) {
        this.tag = "";
        this.closed = closed || false;
        this.tagParts = {
            "name": name || undefined,
            "attributes": attributes || {},
            "elements": []
        };
    }

    build() {
        if (this.tagParts.name) {
            var start = "<" + this.tagParts.name;
        } else {
            throw new Error('Name not provided!');
        }

        var middle = "";
        for (var attribute in this.tagParts.attributes) {
            var value = this.tagParts.attributes[attribute];
            middle += " " + attribute + '="' + value + '"';
        }

        var end = this.closed ? "/>" : ">";

        return start + middle + end;
    }

    setName(name) {
        return this.tagParts.name = name;
    }

    setClosed(state) {
        state = state || false;
        return this.closed = state;
    }

    setAttributes(attributes) {
        return this.tagParts.attributes = attributes;
    }

    attributes(attributes) {
        for (var attribute in attributes) {
            this.attribute(attribute, attributes[attribute]);
        }
        return this.tagParts.attributes;
    }

    attribute(label, value) {
        this.tagParts.attributes[label] = value;
        return this.tagParts.attributes;
    }

    removeAttribute(label) {
        delete this.tagParts.attributes[label];
    }

}

module.exports = {
    xmlParser: xmlParser,
    xmlJsonLoop: xmlJsonLoop,
    tagBuilder: tagBuilder
};