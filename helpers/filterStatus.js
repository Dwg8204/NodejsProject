module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "active"
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        },
        {
            name: "Chờ duyệt",
            status: "pending",
            class: ""
        }
    ]
    
    return filterStatus;
}