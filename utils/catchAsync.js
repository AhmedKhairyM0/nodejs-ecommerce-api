const catchAsync = (fn) =>
  function (...args) {
    const next = args[args.length - 1];
    return Promise.resolve(fn(...args)).catch(next);
  };

// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

module.exports = catchAsync;
