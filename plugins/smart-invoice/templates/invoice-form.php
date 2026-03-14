<h2>Create Invoice</h2>

<form method="post">

    <select id="business_type" name="business_type">
        <option value="">Select Business Type</option>
        <option value="doctor">Doctor</option>
        <option value="consultant">Consultant</option>
        <option value="freelancer">Freelancer</option>
    </select>

    <input type="text" name="client_name" placeholder="Client Name">

    <!-- Doctor fields -->
    <div id="doctor_fields" style="display:none">
        Patient Name: <input name="patient_name">
        Diagnosis: <input name="diagnosis">
    </div>

    <!-- Freelancer fields -->
    <div id="freelancer_fields" style="display:none">
        Project Name: <input name="project_name">
        Hours: <input name="hours">
    </div>

    <button type="submit" name="save_invoice">Save</button>

</form>
