import Customer from "../models/Customer.js";

/** Create customer */
export const createCustomer = async (data) => {
  return Customer.create(data);
};

/** Get by id */
export const getCustomerById = async (id) => {
  return Customer.findOne({ _id: id, isDeleted: false }).populate("assignedTo", "name email");
};

/** Update */
export const updateCustomer = async (id, update) => {
  return Customer.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: update }, { new: true });
};

/** Soft delete */
export const deleteCustomer = async (id) => {
  await Customer.findByIdAndUpdate(id, { isDeleted: true });
};

/** List with pagination/search/filter */
export const listCustomers = async (query) => {
  const page = Math.max(1, parseInt(query.page || 1));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || 20)));
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  if (query.status) filter.status = query.status;

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
    Customer.find(filter).populate("assignedTo", "name email").sort(sort).skip(skip).limit(limit),
    Customer.countDocuments(filter)
  ]);

  return { page, limit, total, pages: Math.ceil(total / limit), items };
};
