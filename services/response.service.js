const { OK } = require('../constants/http-codes');

const success = (data = null, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
}

const paginated = (items, total, page, limit) => {
  return {
    success: true,
    data: {
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  };
}

const send = (status = OK, res, data = null, message = 'Success') => {
  res.status(status).json(success(data, message));
}

const sendPaginated = (res, items, total, page, limit) => {
  res.status(OK).json(paginated(items, total, page, limit));
}

module.exports = { send, sendPaginated };
