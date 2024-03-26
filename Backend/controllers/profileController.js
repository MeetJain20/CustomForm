const AdminModel = require("../models/AdminModel");
const EmployeeModel = require("../models/EmployeeModel");

const getadmprofiledetails = async (req, res, next) => {
  const { userid } = req.params;
  try {
    const getprofiledet = await AdminModel.find({ _id: userid });
    // console.log("prof: ", getprofiledet);
    if (!getprofiledet) {
      return res.status(404).json("Profile with given Id not found");
    }
    return res.status(200).json(getprofiledet);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching Admin details" });
  }
};

const getempprofiledetails = async (req, res, next) => {
  const { userid } = req.params;
  try {
    const getprofiledet = await EmployeeModel.find({ _id: userid });
    // console.log("prof: ", getprofiledet);
    if (!getprofiledet) {
      return res
        .status(404)
        .json({ message: "Profile with given Id not found" });
    }
    return res.status(200).json(getprofiledet);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching Employee details" });
  }
};

const updateadmprofiledetails = async (req, res, next) => {
    try {
      const { userid, empName, mobile, email } = req.body;
      
      const updateprofile = await AdminModel.updateOne(
        { _id: userid },
        {
          $set: {
            empName,
            email,
            mobile
          },
        }
      );
      
      if (!updateprofile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating profile" });
    }
  };

const updateempprofiledetails = async (req, res, next) => {
    try {
      const { userid, empName, mobile, email } = req.body;
      
      const updateprofile = await EmployeeModel.updateOne(
        { _id: userid },
        {
          $set: {
            empName,
            email,
            mobile
          },
        }
      );
      
      if (!updateprofile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating profile" });
    }
  };
  

exports.getadmprofiledetails = getadmprofiledetails;
exports.getempprofiledetails = getempprofiledetails;
exports.updateadmprofiledetails = updateadmprofiledetails;
exports.updateempprofiledetails = updateempprofiledetails;
