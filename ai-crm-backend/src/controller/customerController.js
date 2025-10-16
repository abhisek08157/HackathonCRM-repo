import * as customerService from "../services/customerServices.js";

export const createCustomer = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.name) return res.status(400).json({ message: "name is required" });
    const customer = await customerService.createCustomer({ ...body, assignedTo: body.assignedTo || req.user._id });
    res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    if (!customer) return res.status(404).json({ message: "Customer not found or deleted" });
    res.json({ message: "Customer updated", customer });
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.json({ message: "Customer soft-deleted" });
  } catch (err) {
    next(err);
  }
};

export const listCustomers = async (req, res, next) => {
  try {
    const data = await customerService.listCustomers(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
