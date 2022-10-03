module.exports = () => (next) => async (root, args, context, info) => {
  try {
    await context.auth.check();
    return next(root, args, context, info);
  } catch {
    throw new Error('Not authenticated');
  }
};
