# Cerebro-hosts

> Cerebro plugin for manage /etc/hosts entries

![](demo.gif)

## Features

* List hosts configured in ```/etc/hosts``` file.
* Quick open ```/etc/hosts``` with the default editor.
* Add / Remove hosts

## Available Commands

* ```hosts``` - Show all hosts from /etc/hosts file
* ```hosts add <ip> <domain>``` - Add a new host configuration to hosts file.
* ```hosts remove <ip> <domain>``` - Remove host configuration to hosts file.

## Libraries

* [node-notifier](https://github.com/mikaelbr/node-notifier) - Node library for show desktop notifications.
* [hostile](https://www.npmjs.com/package/hostile) - Node library for parsing hosts file


## Related

* [Cerebro](http://github.com/KELiON/cerebro) – Plugin extracted from core Cerebro app;
* [cerebro-plugin](http://github.com/KELiON/cerebro-plugin) – boilerplate to create Cerebro plugins;

## License

MIT © [Bruno Paz](http://brunopaz.net)
