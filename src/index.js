'use strict';

const PLUGIN_REGEX = /hosts\s(.*)/;
const icon = require('../assets/icon.png');
const iconActions = require('../assets/icon_actions.png');
const hosts = require('./hosts');
const { shell } = require('electron');
const notifier = require('node-notifier');
const commands = require('./commands');
const commandParser = require('./commandParser');

const NOTIFICATION_TITLE = 'cerebro-hosts';

const DEFAULT_ITEMS = [
  {
    title: 'Edit /etc/hosts file',
    icon: iconActions,
    onSelect: (event) => {
      shell.openItem(hosts.getHostsFile());
    }
  },
  {
    title: 'Reload hosts cache',
    icon: iconActions,
    onSelect: (event) => {
      hosts.reload();
      notifier.notify({
        title: NOTIFICATION_TITLE,
        message: 'Hosts reloaded!',
      });

      event.preventDefault();
    }  
  }
]

/**
 * Plugin entry point
 */
const plugin = ({ term, display, actions }) => {

  const match = term.match(PLUGIN_REGEX);

  if (match) {
    let searchTerm = match[1].trim();

    let parsedCommand = commandParser.parse(searchTerm);
    switch (parsedCommand.command) {
      case commands.ADD:
        displayAddHost(parsedCommand, display, actions);
        break;
      case commands.REMOVE:
        displayRemoveHost(parsedCommand, display, actions);
        break;
      default:
        displayHostsList(searchTerm, display, actions);
        break;
    }
  }
}

/**
 * Helper function for displaying "Add host" menu
 * @param {string} command 
 * @param {object} display 
 * @param {object} actions
 */
const displayAddHost = (command, display, actions) => {
  display({
    title: `Set ${command.domain} to ${command.ip} in hosts file`,
    icon: icon,
    onSelect: (event) => {
      hosts.add(command.ip, command.domain).then(() => {
        notifier.notify({
          title: NOTIFICATION_TITLE,
          message: 'Hosts file updated successfully',
        });
      }).catch((err => {
        notifier.notify({
          title: NOTIFICATION_TITLE,
          message: err,
        });
      }));
    }
  });
}
/**
 * Helper function for displaying "Remove host" menu
 * @param {string} command 
 * @param {object} display 
 * @param {object} actions
 */
const displayRemoveHost = (command, display, actions) => {
  display({
    title: `Remove ${command.domain} to ${command.ip} in hosts file`,
    icon: icon,
    onSelect: (event) => {
      hosts.remove(command.ip, command.domain).then(() => {
        notifier.notify({
          title: NOTIFICATION_TITLE,
          message: 'Hosts file updated successfully',
        });
      }).catch((err => {
        notifier.notify({
          title: NOTIFICATION_TITLE,
          message: 'Error updating hosts file',
        });
      }));
    }
  });
}

/**
 * Helper function for displaying the "Hosts List"
 * @param {string} searchTerm The searched term inserted by the user 
 * @param {object} display 
 * @param {object} actions
 */
const displayHostsList = (searchTerm, display, actions) => {
  hosts.list(searchTerm).then((hostsList) => {
    hostsList = hostsList.map((item) => {
      return {
        title: `${item.ip} : ${item.domain}`,
        icon: icon,
        onSelect: (event) => {
          shell.openExternal('http://' + item.domain);
        }
      }
    });

    let items = DEFAULT_ITEMS.concat(hostsList);

    display(items);

  }).catch((err) => {
    display({
      title: 'Error fetching hosts list',
      icon: icon,
    });
  });
}

module.exports = {
  fn: plugin,
  name: 'Manage /etc/hosts file',
  keyword: 'hosts',
  icon,
};