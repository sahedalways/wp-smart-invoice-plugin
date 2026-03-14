<?php
class SI_DB
{

    public function __construct()
    {
        register_activation_hook(
            plugin_dir_path(__FILE__) . '../smart-invoice.php',
            [$this, 'create_tables']
        );
    }

    public function create_tables()
    {

        global $wpdb;

        $table = $wpdb->prefix . 'si_invoices';
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_no VARCHAR(50),
            business_type VARCHAR(50),
            client_name VARCHAR(100),
            total FLOAT,
            status VARCHAR(20),
            extra_data LONGTEXT,
            created_at DATETIME
        ) $charset;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
