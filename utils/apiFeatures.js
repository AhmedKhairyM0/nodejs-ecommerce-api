class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);

    return this;
  }

  sort() {
    // /products?sort=price,-createdAt
    console.log(this.queryString);
    if (this.queryString.sort) {
      this.queryString.sort = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(`${this.queryString.sort} -createdAt`);
    } else {
      this.query = this.query.sort(`-createdAt`);
    }
    return this;
  }

  limitFields() {
    // /products?fields=-category
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query.select(`${fields} -__v`);
    } else {
      this.query.select(`-__v`);
    }
    return this;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "search", "q"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
}

module.exports = APIFeatures;
