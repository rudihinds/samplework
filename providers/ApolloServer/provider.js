'use strict';

/**
 * adonis-apollo-server
 *
 * (c) Chimezie Enyinnaya <meziemichael@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold');

class ApolloServerProvider extends ServiceProvider {
  /**
   * Register AdonisApollo to the IoC container
   * with `Adonis/Addons/ApolloServer` namespace.
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('ApolloServer', () => {
      return new (require('./index'))();
    });

    // this.app.alias('Adonis/Addons/ApolloServer', 'ApolloServer');
  }
}

module.exports = ApolloServerProvider;
