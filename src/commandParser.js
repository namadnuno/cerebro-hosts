'use strict';

const commands = require('./commands');

// TODO this regexes could be improved by validatiing ip addresses and domain names
const REGEX_ADD_COMMAND = /add\s(.*)\s(.*)/; 
const REGEX_REMOVE_COMMAND = /remove\s(.*)\s(.*)/;

/**
 * Parses the search term and lookup for commands.
 * @param {string} term The search term
 */
const parse = (term) => {
    let match = term.match(REGEX_ADD_COMMAND);

    if (match) {
        return {
            'command': commands.ADD,
            'ip': match[1],
            'domain': match[2]
        }
    }

    match = term.match(REGEX_REMOVE_COMMAND);

    if (match) {
        return {
            'command': commands.REMOVE,
            'ip': match[1],
            'domain': match[2]
        }
    }

    return {
        'command': commands.LIST,
    }
}

module.exports = {
    parse
}