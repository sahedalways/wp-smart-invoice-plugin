<?php

/**
 * Plugin Name: Smart Invoice Generator
 * Plugin URI:  https://example.com/smart-invoice
 * Description: Multi-industry smart invoice generator with dynamic business-type-based fields for WordPress.
 * Version:     1.0.0
 * Author:      Sk Sahed Ahmed
 * Author URI:  https://example.com
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: smart-invoice-generator
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP:      7.4
 */

if (!defined('ABSPATH')) exit;

define('SI_PATH', plugin_dir_path(__FILE__));
define('SI_URL', plugin_dir_url(__FILE__));

require SI_PATH . 'includes/class-db.php';
require SI_PATH . 'includes/class-admin.php';

new SI_DB();
new SI_Admin();


register_activation_hook(__FILE__, function () {
    $db = new SI_DB();
    $db->create_tables();
    update_option('si_tables_created', 'yes');
});
