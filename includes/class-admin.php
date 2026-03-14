<?php
class SI_Admin
{

    public function __construct()
    {
        add_action('admin_menu', [$this, 'menu']);
        add_action('admin_enqueue_scripts', [$this, 'scripts']);
    }

    public function menu()
    {
        add_menu_page(
            'Smart Invoice',
            'Smart Invoice',
            'manage_options',
            'smart-invoice',
            [$this, 'invoice_page']
        );
    }

    public function scripts()
    {
        wp_enqueue_script(
            'si-admin',
            SI_URL . 'assets/js/admin.js',
            [],
            '1.0',
            true
        );
    }

    public function invoice_page()
    {

        global $wpdb;

        if (isset($_POST['save_invoice'])) {

            $extra = [];

            if ($_POST['business_type'] == 'doctor') {
                $extra = [
                    'patient_name' => $_POST['patient_name'],
                    'diagnosis' => $_POST['diagnosis']
                ];
            }

            if ($_POST['business_type'] == 'freelancer') {
                $extra = [
                    'project_name' => $_POST['project_name'],
                    'hours' => $_POST['hours']
                ];
            }

            $wpdb->insert(
                $wpdb->prefix . 'si_invoices',
                [
                    'invoice_no' => uniqid('INV-'),
                    'business_type' => $_POST['business_type'],
                    'client_name' => $_POST['client_name'],
                    'total' => 0,
                    'status' => 'unpaid',
                    'extra_data' => json_encode($extra),
                    'created_at' => current_time('mysql')
                ]
            );

            echo "<p>Invoice Saved!</p>";
        }

        include SI_PATH . 'templates/invoice-form.php';
    }
}
