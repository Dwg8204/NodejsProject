const tablePermissions = document.querySelector("[table-permission]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", function () {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("tr[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name == "id"){
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({

                        id: id,
                        permissions: []
                    });
                });
            }
            else{
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }

        });
        console.log(permissions);
        if (permissions.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermission.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermission.submit();
        }
    });
}

const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permission]");
    records.forEach((record,index) => {
        const permissions=record.permissions;
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`tr[data-name="${permission}"]`);
            const inputs = row.querySelectorAll("input")[index];
            inputs.checked = true;
            
        });
    });
}
