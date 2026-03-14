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
            [$this, 'invoice_page'],
            'dashicons-media-spreadsheet'
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


        wp_enqueue_script(
            'invoice-form-js',
            SI_URL . 'assets/js/invoice-form.js',
            [],
            '1.0',
            true
        );

        wp_enqueue_style(
            'si-admin-style',
            SI_URL . 'assets/css/admin.css',
            [],
            '1.0'
        );


        wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
        wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', ['jquery'], null, true);

        wp_enqueue_style('dashicons');
    }



    public function invoice_page()
    {
        global $wpdb;

        // Load professions JSON
        $json_file = SI_PATH . 'assets/data/professions.json';
        $professions = json_decode(file_get_contents($json_file), true);

        if (isset($_POST['save_invoice'])) {

            $business_type = sanitize_text_field($_POST['business_type']);
            $extra = [];

            $selected = array_filter($professions, function ($p) use ($business_type) {
                return $p['id'] === $business_type;
            });

            if (!empty($selected)) {
                $selected = array_values($selected)[0];
                foreach ($selected['fields'] as $field) {
                    $name = $field['name'];
                    if (isset($_POST[$name])) {
                        if (in_array($name, ['fee', 'cost', 'rate', 'hours'])) {
                            $extra[$name] = floatval($_POST[$name]);
                        } else {
                            $extra[$name] = sanitize_text_field($_POST[$name]);
                        }
                    }
                }
            }


            $client_name_fields = ['client_name', 'student_name', 'project_name', 'patient_name'];
            $client_name = '';
            foreach ($client_name_fields as $field) {
                if (!empty($extra[$field])) {
                    $client_name = $extra[$field];
                    break;
                }
            }

            $total = 0;
            foreach ($extra as $key => $value) {
                if (in_array($key, ['fee', 'cost', 'rate', 'hours'])) {
                    $total += floatval($value);
                }
            }
            $wpdb->insert(
                $wpdb->prefix . 'si_invoices',
                [
                    'invoice_no'     => uniqid('INV-'),
                    'business_type'  => $business_type,
                    'client_name'    => $client_name,
                    'total'          => $total,
                    'status'         => sanitize_text_field($_POST['status']),
                    'discount'       => floatval($_POST['discount'] ?? 0),
                    'tax'            => floatval($_POST['tax'] ?? 0),
                    'net_amount'     => floatval($_POST['net_amount'] ?? 0),
                    'extra_data'     => wp_json_encode($extra),
                    'created_at'     => current_time('mysql')
                ]
            );
            echo "<p>Invoice Saved!</p>";
        }

        include SI_PATH . 'templates/invoice-form.php';
    }
}
