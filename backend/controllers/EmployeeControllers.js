import Employee from "../models/EmployeeModel.js";

//data display
const getAllEmployees = async (req, res, next) => {
    let employees;

    //get all employees
    try {
        employees = await Employee.find();
    } catch (err) {
        console.log(err);
    }
    //not found
    if (!employees) {
        return res.status(404).json({ message: "Employee not found" });
    }
    //display all employees
    return res.status(200).json({ employees });
};

//data insert
const addEmployees = async (req, res, next) => {
    const { name, age, gender, designation, address, email, phone, nicNo, date_joined } = req.body;
    //Validate gender
    const validateGenders = ["Male", "Female", "Other"];
    if (!validateGenders.includes(gender)) {
        return res.status(400).json({ message: "Invalid gender. Allowed values: Male,Female,Other" });
    }
    let employees;
    try {
        employees = new Employee({ name, age, gender, designation, address, email, phone, nicNo, date_joined });
        await employees.save();
    } catch (err) {
        console.log(err);
    }
    //not insert employees
    if (!employees) {
        return res.status(404).send({ message: "unable to add employees" });
    }
    return res.status(200).json({ employees });
};

//get by id
const getById = async (req, res, next) => {
    const id = req.params.id;

    let employee;
    try {
        employee = await Employee.findById(id);
    } catch (err) {
        console.log(err);
    }
    //not available employees
    if (!employee) {
        return res.status(404).send({ message: "Employee Not Found" });
    }
    return res.status(200).json({ employee });
};

//update employee details
const updateEmployee = async (req, res, next) => {
    const id = req.params.id;
    const { name, age, gender, designation, address, email, phone, nicNo, date_joined } = req.body;
    //Validate gender
    const validateGenders = ["Male", "Female", "Other"];
    if (!validateGenders.includes(gender)) {
        return res.status(400).json({ message: "Invalid gender. Allowed values: Male,Female,Other" });
    }

    let employees;
    try {
        employees = await Employee.findByIdAndUpdate(id,
            { name, age, gender, designation, address, email, phone, nicNo, date_joined });

    } catch (err) {
        console.log(err);
    }

    if (!employees) {
        return res.status(404).send({ message: "Unable to Update Employee details" });
    }
    return res.status(200).json({ employees });
};

//delete employee details
const deleteEmployee = async (req, res, next) => {
    const id = req.params.id;
    const { name, age, gender, designation, address, email, phone, nicNo, date_joined } = req.body;

    let employees;
    try {
        employees = await Employee.findByIdAndDelete(id,
            { name, age, gender, designation, address, email, phone, nicNo, date_joined });
    } catch (err) {
        console.log(err);
    }
    if (!employees) {
        return res.status(404).send({ message: "Unable to Update Employee details" });
    }
    return res.status(200).json({ employees });
};

// Check NIC uniqueness
const checkNICUnique = async (req, res) => {
    const { nic } = req.query;
    
    if (!nic) {
        return res.status(400).json({ message: "NIC number is required" });
    }

    try {
        const existingEmployee = await Employee.findOne({ nicNo: nic });
        return res.status(200).json({ exists: !!existingEmployee });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error checking NIC uniqueness" });
    }
};

export {
    getAllEmployees,
    addEmployees,
    getById,
    updateEmployee,
    deleteEmployee,
    checkNICUnique
};