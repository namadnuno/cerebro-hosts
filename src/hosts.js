
'use strict';

const hostile = require('hostile');
const { memoize } = require('cerebro-tools');

const MEMOIZE_OPTIONS = {
    promise: 'then',
    maxAge: 300000, // 5 minutes
    preFetch: true
}

/**
 * Returns the absolute path to the "hosts" file based on the OS.
 * @return {string}
 */
const getHostsFile = () => {
    
    if  (process.platform === 'win32') {
        return 'C:/Windows/System32/drivers/etc/hosts';
    }

    return '/etc/hosts';
}

/**
 * Get a list of entries from /etc/hosts file.
 * @param {string} filterTerm optional String to filter the hosts list.
 * @return {promise}
 */
const list = memoize((filterTerm) => {

    let hosts = [];

    return new Promise((resolve, reject) => {
        hostile.get(false, (err, lines) => {
            if (err) {
                console.error(err.message);
                reject(err);
            }

            lines.forEach((line) => {

                if (!filterTerm || (line[0].includes(filterTerm) || line[1].includes(filterTerm))) {
                    hosts.push({
                        ip: line[0],
                        domain: line[1]
                    });
                }      
            });
            resolve(hosts);
        });
    });
}, MEMOIZE_OPTIONS );    

/**
 * Adds / Updates a value in /etc/hosts file
 * @param {string} ip 
 * @param {string} domain 
 */
const add = (ip, domain) => {
    
    return new Promise((resolve, reject) => {
        hostile.set(ip, domain, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log('set /etc/hosts successfully!');
                list.clear(); // clear memoize cache
                resolve();
            }
        })
    });
}

/**
 * Removes a value from /etc/hosts file.
 * @param {string} ip 
 * @param {string} domain 
 */
const remove = (ip, domain) => {
    return new Promise((resolve, reject) => {
        hostile.remove(ip, domain, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log('set /etc/hosts successfully!');
                list.clear(); // clear memoize cache
                resolve();
            }
        })
    });
}

/**
 * Clears the memoize cache.
 */
const reload = () => {
    list.clear();
}

module.exports = {
    list,
    add,
    remove,
    getHostsFile,
    reload
}