import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
const rows: GridRowsProp = [
    {
        id: 1,
        emp_id: "68319",
        emp_name: "KAYLING",
        emp_profile: "President",
        emp_salary: "60000"
    },
    {
        id: 2,
        emp_id: "68339",
        emp_name: "BLAZE",
        emp_profile: "Manager",
        emp_salary: "47500"
    },
    {
        id: 3,
        emp_id: "68710",
        emp_name: "JONAS",
        emp_profile: "Analyst",
        emp_salary: "30000"
    }
];
const columns: GridColDef[] = [
    {
        field: "emp_id",
        headerName: "ID",
        width: 100,
        editable: true,
        headerClassName: "header-styles"
    },
    {
        field: "emp_name",
        headerName: "Name",
        width: 100,
        headerClassName: "header-styles"
    },
    {
        field: "emp_profile",
        headerName: "Profile",
        width: 100,
        headerClassName: "header-styles"
    },
    { field: "emp_salary", headerName: "Salary", width: 100 }
];
const EmployeeTable = () => {
    return (
        <div style={{ width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                    sorting: {
                        sortModel: [{ field: "emp_salary", sort: "asc" }]
                    }
                }}
                checkboxSelection={true}
                disableSelectionOnClick
                sx={{
                    boxShadow: 1,
                    "& .MuiDataGrid-cell:hover": {
                        color: "primary.main"
                    }
                }}
            />
        </div>
    );
};
export default EmployeeTable;