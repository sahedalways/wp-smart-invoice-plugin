<?php
$json = file_get_contents(SI_PATH . 'assets/data/professions.json');
$professions = json_decode($json, true);
?>

<div class="invoice-form-container">
    <div class="invoice-form-header">
        <h2 class="text-white">Create Invoice</h2>
    </div>

    <form method="post" class="invoice-form-body">

        <div class="invoice-field-group">
            <label for="business_type">
                Business Type
                <span class="dashicons dashicons-star-filled required-star"></span>
            </label>
            <select id="business_type" name="business_type">
                <option value="">Select Business Type</option>
                <?php foreach ($professions as $p): ?>
                    <option value="<?php echo esc_attr($p['id']); ?>">
                        <?php echo esc_html($p['name']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>


        <!-- Dynamic fields container -->
        <div id="dynamic_fields_container">

        </div>

        <div style="margin-top: 30px;">
            <button type="submit" name="save_invoice" class="btn-save-invoice">Save Invoice</button>
        </div>

    </form>
</div>


<script>
    const professions = <?php echo json_encode($professions); ?>;
</script>
