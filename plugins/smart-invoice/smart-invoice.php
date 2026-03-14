<?php

/**
 * Plugin Name: Smart Invoice Generator
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

define('SI_PATH', plugin_dir_path(__FILE__));
define('SI_URL', plugin_dir_url(__FILE__));

require SI_PATH . 'includes/class-db.php';
require SI_PATH . 'includes/class-admin.php';

new SI_DB();
new SI_Admin();
