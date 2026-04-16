const asyncHandler = require("../utils/asyncHandler");

const createCrudController = (Model, options = {}) => {
  const applyPopulate = (query) => {
    if (!options.populate) {
      return query;
    }

    if (Array.isArray(options.populate)) {
      return options.populate.reduce(
        (currentQuery, populateOption) => currentQuery.populate(populateOption),
        query
      );
    }

    return query.populate(options.populate);
  };

  return {
    getAll: asyncHandler(async (req, res) => {
      let query = Model.find();
      query = applyPopulate(query);

      const data = await query.sort(options.sort || { createdAt: -1 });

      res.json({
        success: true,
        count: data.length,
        data,
      });
    }),

    getById: asyncHandler(async (req, res) => {
      let query = Model.findById(req.params.id);
      query = applyPopulate(query);
      const data = await query;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bản ghi.",
        });
      }

      return res.json({
        success: true,
        data,
      });
    }),

    create: asyncHandler(async (req, res) => {
      const createdItem = await Model.create(req.body);
      let data = createdItem;

      if (options.populate) {
        let query = Model.findById(createdItem._id);
        query = applyPopulate(query);
        data = await query;
      }

      res.status(201).json({
        success: true,
        message: "Tạo mới thành công.",
        data,
      });
    }),

    update: asyncHandler(async (req, res) => {
      let query = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      query = applyPopulate(query);
      const data = await query;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bản ghi để cập nhật.",
        });
      }

      return res.json({
        success: true,
        message: "Cập nhật thành công.",
        data,
      });
    }),

    remove: asyncHandler(async (req, res) => {
      const deletedItem = await Model.findByIdAndDelete(req.params.id);

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bản ghi để xóa.",
        });
      }

      return res.json({
        success: true,
        message: "Xóa thành công.",
      });
    }),
  };
};

module.exports = createCrudController;
