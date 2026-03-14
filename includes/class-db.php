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
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            invoice_no VARCHAR(50) NOT NULL,
            business_type VARCHAR(50) NOT NULL,
            client_name VARCHAR(100) NULL,
            total DECIMAL(15,2) NULL,
            discount DECIMAL(15,2) DEFAULT 0.00,
            tax DECIMAL(15,2) DEFAULT 0.00,
            net_amount DECIMAL(15,2) DEFAULT 0.00,
            status ENUM('Pending', 'Unpaid', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled', 'Refunded') DEFAULT 'Pending',
            extra_data LONGTEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) $charset;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
