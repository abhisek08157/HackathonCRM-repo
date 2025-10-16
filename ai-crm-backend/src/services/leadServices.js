import Lead from "../models/Lead.js";
import Customer from "../models/Customer.js";

/**
 * Create a new lead
 */
export const createLead = async (data) => {
  const lead = await Lead.create(data);
  return lead;
};

/**
 * Get a lead by ID (skip if deleted)
 */
export const getLeadById = async (id) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false }).populate("assignedTo", "name email");
  return lead;
};

/**
 * Update lead
 */
export const updateLead = async (id, update) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: update }, { new: true });
  return lead;
};

/**
 * Soft delete lead
 */
export const deleteLead = async (id) => {
  await Lead.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return;
};

/**
 * List leads with pagination, search, filter, sort
 * query = { page, limit, search, status, assignedTo, sortBy }
 */
export const listLeads = async (query) => {
  const page = Math.max(1, parseInt(query.page || 1));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || 20)));
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  if (query.source) filter.source = query.source;

  if (query.search) {
    const s = query.search;
    filter.$or = [
      { name: { $regex: s, $options: "i" } },
      { email: { $regex: s, $options: "i" } },
      { phone: { $regex: s, $options: "i" } },
      { company: { $regex: s, $options: "i" } }
    ];
  }

  const sort = {};
  if (query.sortBy) {
    const [key, dir] = query.sortBy.split(":");
    sort[key] = dir === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const [items, total] = await Promise.all([
    Lead.find(filter).populate("assignedTo", "name email").sort(sort).skip(skip).limit(limit),
    Lead.countDocuments(filter)
  ]);

  return {
    page, limit, total, pages: Math.ceil(total / limit), items
  };
};

/**
 * Convert lead to customer
 * Steps:
 *  - create customer doc with data from lead
 *  - set lead.status = CONVERTED & convertedTo = newCustomer._id
 */
export const convertLeadToCustomer = async (leadId, operatorId) => {
  const lead = await Lead.findOne({ _id: leadId, isDeleted: false });
  if (!lead) {
    const err = new Error("Lead not found");
    err.status = 404;
    throw err;
  }
  if (lead.status === "CONVERTED" && lead.convertedTo) {
    const existing = await Customer.findById(lead.convertedTo);
    return { converted: false, customer: existing, message: "Already converted" };
  }

  const customerData = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    source: "lead",
    assignedTo: lead.assignedTo,
    notes: lead.notes || []
  };

  const customer = await Customer.create(customerData);

  lead.status = "CONVERTED";
  lead.convertedTo = customer._id;
  await lead.save();

  return { converted: true, customer };
};
