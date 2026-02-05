const asyncHandler = async (fn) => {
  return async function (req, res, next) {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
};

export { asyncHandler };
