import * as leadService from "../services/leadServices.js";

export const createLead = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.name) return res.status(400).json({ message: "name is required" });
    const lead = await leadService.createLead({ ...body, assignedTo: body.assignedTo || req.user._id });
    res.status(201).json({ message: "Lead created", lead });
  } catch (err) {
    next(err);
  }
};

export const getLead = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ message: "Lead not found or deleted" });
    res.json({ message: "Lead updated", lead });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.json({ message: "Lead soft-deleted" });
  } catch (err) {
    next(err);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const data = await leadService.listLeads(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const convertLead = async (req, res, next) => {
  try {
    const result = await leadService.convertLeadToCustomer(req.params.id, req.user._id);
    res.json({ message: result.converted ? "Converted to customer" : result.message, customer: result.customer });
  } catch (err) {
    next(err);
  }
};
